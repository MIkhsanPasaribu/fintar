import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { SupabaseService } from "../common/supabase/supabase.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // First try local user validation (primary)
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }

    // Fallback to Supabase auth if available and local auth fails
    if (this.supabaseService.isSupabaseAvailable()) {
      try {
        const { data: supabaseUser, error } = await this.supabaseService.signIn(
          email,
          password
        );

        if (supabaseUser?.user && !error) {
          const { user } = supabaseUser;
          return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
          };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(`Supabase authentication failed: ${errorMessage}`);
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    try {
      // Create user record in our database first (primary)
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        email,
        username: email.split("@")[0], // Generate username from email
        password: hashedPassword,
        firstName: name || email.split("@")[0],
      };

      // Try to register with Supabase if available
      let supabaseUserId = null;
      if (this.supabaseService.isSupabaseAvailable()) {
        try {
          const { data: supabaseUser, error: supabaseError } =
            await this.supabaseService.signUp(email, password);

          if (supabaseError) {
            this.logger.warn(
              `Supabase registration failed: ${supabaseError.message}`
            );
          } else {
            supabaseUserId = supabaseUser.user?.id;
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(`Supabase registration error: ${errorMessage}`);
        }
      }

      // Create user with optional Supabase ID
      const user = await this.usersService.create({
        ...userData,
        supabaseId: supabaseUserId,
      });

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException("Registration failed");
    }
  }

  async logout() {
    // Try to sign out from Supabase if available
    if (this.supabaseService.isSupabaseAvailable()) {
      try {
        await this.supabaseService.signOut();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(`Supabase logout failed: ${errorMessage}`);
      }
    }
    return { message: "Logged out successfully" };
  }
}
