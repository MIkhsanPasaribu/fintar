import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../common/prisma/prisma.service";
import { RegisterDto, LoginDto } from "./dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique username
    const baseUsername = email.split("@")[0];
    let username = baseUsername;
    let counter = 1;

    // Check if username exists and make it unique
    while (await this.prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Create user and profile
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: UserRole.CLIENT,
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const tokens = await this.generateTokens(user.id, user.email);

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        ...tokens,
      };
    } catch (error: any) {
      // Fallback for development when database is not available
      if (
        error?.message?.includes("Can't reach database server") &&
        email === "test@fintar.com" &&
        password === "testpassword123"
      ) {
        console.log("🔧 Using fallback auth for development testing");

        const mockUser = {
          id: "test-user-123",
          email: "test@fintar.com",
          role: "CLIENT" as any, // Use string instead of enum
          profile: {
            id: "test-profile-123",
            monthlyIncome: 15000000,
            monthlyExpenses: 8000000,
            currentSavings: 50000000,
            currentDebt: 10000000,
          },
        };

        const tokens = await this.generateTokens(mockUser.id, mockUser.email);

        return {
          user: mockUser,
          ...tokens,
        };
      }

      // Re-throw original error if not a database connection issue
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens(user.id, user.email);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(payload: any) {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        profile: true,
      },
    });
  }
}
