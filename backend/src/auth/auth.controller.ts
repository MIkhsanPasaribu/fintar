import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error("Login failed:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      // Handle specific timeout errors
      if (
        (error instanceof Error && error.message.includes("timeout")) ||
        (error instanceof Error && error.message.includes("unavailable"))
      ) {
        throw new HttpException(
          "Authentication service is temporarily unavailable. Please try again later.",
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      throw new HttpException(
        "Authentication failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error("Registration failed:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException("Registration failed", HttpStatus.BAD_REQUEST);
    }
  }

  @Post("logout")
  async logout() {
    try {
      return { message: "Logged out successfully" };
    } catch (error) {
      this.logger.error("Logout failed:", error);
      return { message: "Logged out successfully" };
    }
  }

  @Get("verify-email")
  async verifyEmail(@Query("token") token: string) {
    try {
      if (!token) {
        throw new HttpException("Token verifikasi diperlukan", HttpStatus.BAD_REQUEST);
      }
      
      return await this.authService.verifyEmail(token);
    } catch (error) {
      this.logger.error("Email verification failed:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException("Verifikasi email gagal", HttpStatus.BAD_REQUEST);
    }
  }

  @Post("resend-verification")
  async resendVerification(@Body("email") email: string) {
    try {
      if (!email) {
        throw new HttpException("Email diperlukan", HttpStatus.BAD_REQUEST);
      }
      
      return await this.authService.resendVerification(email);
    } catch (error) {
      this.logger.error("Resend verification failed:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException("Gagal mengirim ulang verifikasi", HttpStatus.BAD_REQUEST);
    }
  }
}
