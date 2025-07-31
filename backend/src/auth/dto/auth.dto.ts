import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "User password",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "User password",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "john_doe",
    description: "Username (optional)",
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiProperty({
    example: "John",
    description: "First name (optional)",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({
    example: "Doe",
    description: "Last name (optional)",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: "JWT access token" })
  access_token: string;

  @ApiProperty({ description: "User information" })
  user: {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isVerified: boolean;
  };
}
