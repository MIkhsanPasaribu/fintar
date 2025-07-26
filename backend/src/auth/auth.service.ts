import {
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
  Logger,
} from "@nestjs/common";
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
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...result } = user;
        this.logger.log(
          `User validated successfully via local database: ${email}`
        );
        return result;
      }
    } catch (error) {
      this.logger.error("Local user validation failed:", error);

      // If database is unavailable, fall back to Supabase
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("permission denied") ||
        errorMessage.includes("database") ||
        errorMessage.includes("connection")
      ) {
        this.logger.warn(
          "Database unavailable, falling back to Supabase authentication"
        );
      }
    }

    // Fallback to Supabase auth if available and local auth fails
    try {
      // Check if Supabase configuration is available
      if (!this.supabaseService.isSupabaseAvailable()) {
        this.logger.warn(
          "Supabase configuration not available, skipping Supabase auth"
        );
        return null;
      }

      const authResult = await this.supabaseService.signIn(email, password);

      if (authResult?.user) {
        this.logger.log(`User validated successfully via Supabase: ${email}`);
        return {
          id: authResult.user.id,
          email: authResult.user.email,
          name: authResult.user.user_metadata?.name || authResult.user.email,
        };
      }
    } catch (error) {
      this.logger.error(`Supabase validation failed for ${email}:`, error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Handle specific Supabase errors gracefully
      if (errorMessage.includes("Invalid API key")) {
        this.logger.warn(
          "Supabase API key is invalid, skipping Supabase authentication"
        );
        return null;
      }

      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("CONNECT_TIMEOUT") ||
        errorMessage.includes("fetch failed")
      ) {
        this.logger.warn(
          "Supabase connection failed, authentication will use local database only"
        );
        return null;
      }

      if (errorMessage.includes("unavailable after")) {
        this.logger.warn(
          "Supabase service unavailable after retries, skipping Supabase auth"
        );
        return null;
      }

      // For other errors, log but don't throw - let authentication continue with local only
      this.logger.warn(`Supabase auth error (non-critical): ${errorMessage}`);
    }

    return null;
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);

      this.logger.log(`Login successful for user: ${user.email}`);

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      this.logger.error("Token generation failed:", error);
      throw new ServiceUnavailableException("Authentication service error");
    }
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

      let user;
      let supabaseUserId = null;

      // Try to register with Supabase first (if available and configured)
      if (this.supabaseService.isSupabaseAvailable()) {
        try {
          const supabaseUser = await this.supabaseService.signUp(
            email,
            password
          );
          if (supabaseUser?.user) {
            supabaseUserId = supabaseUser.user.id;
            this.logger.log(`Supabase registration successful for: ${email}`);
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);

          // Handle specific Supabase errors gracefully
          if (errorMessage.includes("Invalid API key")) {
            this.logger.warn(
              "Supabase API key is invalid, proceeding with local registration only"
            );
          } else if (
            errorMessage.includes("timeout") ||
            errorMessage.includes("connection") ||
            errorMessage.includes("fetch failed") ||
            errorMessage.includes("unavailable after")
          ) {
            this.logger.warn(
              "Supabase connection failed, proceeding with local registration only"
            );
          } else {
            this.logger.warn(
              `Supabase registration error (non-critical): ${errorMessage}`
            );
          }
        }
      } else {
        this.logger.warn(
          "Supabase not configured, proceeding with local registration only"
        );
      }

      // Try to create user in local database
      try {
        user = await this.usersService.create({
          ...userData,
          supabaseId: supabaseUserId,
        });
        this.logger.log(`Local database registration successful for: ${email}`);
      } catch (error) {
        this.logger.error("Local user creation failed:", error);

        // If database is unavailable but Supabase worked, return Supabase user
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          supabaseUserId &&
          (errorMessage.includes("permission denied") ||
            errorMessage.includes("database") ||
            errorMessage.includes("connection"))
        ) {
          this.logger.warn(
            "Using Supabase-only registration due to database issues"
          );
          user = {
            id: supabaseUserId,
            email,
            name,
          };
        } else {
          // If both local and Supabase failed, throw error
          if (!supabaseUserId) {
            this.logger.error("Both local and Supabase registration failed");
            throw new UnauthorizedException(
              "Registration failed - service temporarily unavailable"
            );
          }
          throw new UnauthorizedException("Registration failed");
        }
      }

      return this.login(user);
    } catch (error) {
      this.logger.error("Registration process failed:", error);

      // Provide more specific error messages
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        "Registration failed - please try again later"
      );
    }
  }

  async logout() {
    // Try to sign out from Supabase if available and configured
    if (this.supabaseService.isSupabaseAvailable()) {
      try {
        await this.supabaseService.signOut();
        this.logger.log("Supabase logout successful");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        // Handle specific Supabase errors gracefully
        if (errorMessage.includes("Invalid API key")) {
          this.logger.warn(
            "Supabase API key is invalid during logout - continuing with local logout"
          );
        } else if (
          errorMessage.includes("timeout") ||
          errorMessage.includes("connection") ||
          errorMessage.includes("fetch failed")
        ) {
          this.logger.warn(
            "Supabase connection failed during logout - continuing with local logout"
          );
        } else {
          this.logger.warn(
            `Supabase logout failed (non-critical): ${errorMessage}`
          );
        }
      }
    }

    return { message: "Logged out successfully" };
  }
}
