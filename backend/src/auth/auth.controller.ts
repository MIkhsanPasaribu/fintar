import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password
      );

      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      return await this.authService.login(user);
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
      return await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.name
      );
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
      return await this.authService.logout();
    } catch (error) {
      this.logger.error("Logout failed:", error);
      return { message: "Logged out successfully" };
    }
  }
}
