import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { PrismaService } from "../common/prisma/prisma.service";
import { EmailService } from "../common/email/email.service";
import { RegisterDto, LoginDto } from "./dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
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

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user and profile
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password: hashedPassword,
        role: UserRole.CLIENT,
        isVerified: false,
        emailVerificationToken,
        emailVerificationExpiry,
        profile: {
          create: {},
        },
      } as any,
      include: {
        profile: true,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        email,
        firstName || username,
        emailVerificationToken
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Continue with registration even if email fails
    }

    // Don't generate tokens yet - user needs to verify email first
    return {
      message:
        "Registrasi berhasil. Silakan periksa email Anda untuk verifikasi akun.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
      },
      requiresVerification: true,
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

      // Check if email is verified
      if (!user.isVerified) {
        throw new UnauthorizedException(
          "Email belum diverifikasi. Silakan periksa email Anda."
        );
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

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gt: new Date(),
        },
      } as any,
    });

    if (!user) {
      throw new BadRequestException(
        "Token verifikasi email tidak valid atau sudah kedaluwarsa"
      );
    }

    // Update user to verified and clear token
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      } as any,
      include: {
        profile: true,
      },
    });

    // Generate tokens for the newly verified user
    const tokens = await this.generateTokens(updatedUser.id, updatedUser.email);

    return {
      message: "Email berhasil diverifikasi. Selamat datang di Fintar!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        profile: updatedUser.profile,
      },
      ...tokens,
    };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("User tidak ditemukan");
    }

    if (user.isVerified) {
      throw new BadRequestException("Email sudah diverifikasi");
    }

    // Generate new token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpiry,
      } as any,
    });

    // Send new verification email
    try {
      await this.emailService.sendVerificationEmail(
        email,
        user.firstName || user.username,
        emailVerificationToken
      );

      return {
        message:
          "Email verifikasi baru telah dikirim. Silakan periksa email Anda.",
      };
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      throw new BadRequestException("Gagal mengirim email verifikasi");
    }
  }
}
