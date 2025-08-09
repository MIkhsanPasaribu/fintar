import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsObject,
  IsArray,
  IsEmail,
} from "class-validator";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export enum RiskTolerance {
  CONSERVATIVE = "CONSERVATIVE",
  MODERATE = "MODERATE",
  AGGRESSIVE = "AGGRESSIVE",
}

export class UserProfileDto {
  // Allow these fields but ignore them in processing (frontend compatibility)
  @ApiProperty({ example: "user_123", required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: "user@example.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "username", required: false })
  @IsOptional()
  @IsString()
  username?: string;

  // User-specific fields (stored in User table)
  @ApiProperty({ example: "John", required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: "Doe", required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: "+6281234567890", required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: "https://example.com/avatar.jpg", required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  // Profile-specific fields (stored in UserProfile table)
  @ApiProperty({ example: "1990-01-01", required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: "Software Engineer", required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ example: "Tech Corp Indonesia", required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ enum: MaritalStatus, required: false })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  dependents?: number;

  @ApiProperty({ example: "Bachelor Degree", required: false })
  @IsOptional()
  @IsString()
  educationLevel?: string;

  // Financial fields
  @ApiProperty({ example: 10000000, required: false })
  @IsOptional()
  @IsNumber()
  monthlyIncome?: number;

  @ApiProperty({ example: 7000000, required: false })
  @IsOptional()
  @IsNumber()
  monthlyExpenses?: number;

  @ApiProperty({ example: 50000000, required: false })
  @IsOptional()
  @IsNumber()
  currentSavings?: number;

  @ApiProperty({ example: 5000000, required: false })
  @IsOptional()
  @IsNumber()
  currentDebt?: number;

  @ApiProperty({ example: 15000000, required: false })
  @IsOptional()
  @IsNumber()
  emergencyFundAmount?: number;

  @ApiProperty({ enum: RiskTolerance, required: false })
  @IsOptional()
  @IsEnum(RiskTolerance)
  riskTolerance?: RiskTolerance;

  @ApiProperty({ example: ["Emergency Fund", "Buy House"], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  financialGoals?: string[];

  @ApiProperty({ example: "Beginner", required: false })
  @IsOptional()
  @IsString()
  investmentExperience?: string;

  @ApiProperty({ example: {}, required: false })
  @IsOptional()
  @IsObject()
  currentInvestments?: Record<string, any>;

  @ApiProperty({ example: {}, required: false })
  @IsOptional()
  @IsObject()
  assets?: Record<string, any>;

  @ApiProperty({ example: {}, required: false })
  @IsOptional()
  @IsObject()
  liabilities?: Record<string, any>;

  @ApiProperty({ example: {}, required: false })
  @IsOptional()
  @IsObject()
  insurance?: Record<string, any>;

  @ApiProperty({
    example: {
      street: "Jl. Sudirman No. 1",
      city: "Jakarta",
      province: "DKI Jakarta",
      postalCode: "10110",
      country: "Indonesia",
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  address?: Record<string, any>;

  @ApiProperty({ example: "IDR", required: false, default: "IDR" })
  @IsOptional()
  @IsString()
  currency?: string = "IDR";
}
