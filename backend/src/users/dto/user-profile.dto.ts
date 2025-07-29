import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsJSON,
} from "class-validator";
import { Transform } from "class-transformer";
import { Gender, RiskLevel, MaritalStatus } from "@prisma/client";

export class CreateUserProfileDto {
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  company?: string;

  // Financial Information
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  monthlyIncome?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  monthlyExpenses?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  currentSavings?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  currentDebt?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  emergencyFundAmount?: number;

  // Investment & Risk
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  financialGoals?: string[];

  @IsOptional()
  @IsEnum(RiskLevel)
  riskTolerance?: RiskLevel;

  @IsOptional()
  @IsString()
  investmentExperience?: string;

  @IsOptional()
  @IsJSON()
  currentInvestments?: any;

  // Personal Information
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  dependents?: number;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  // Assets & Liabilities
  @IsOptional()
  @IsJSON()
  assets?: any;

  @IsOptional()
  @IsJSON()
  liabilities?: any;

  @IsOptional()
  @IsJSON()
  insurance?: any;

  // Contact & Address
  @IsOptional()
  @IsJSON()
  address?: any;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdateUserProfileDto extends CreateUserProfileDto {}

export class OnboardingStatusDto {
  @IsBoolean()
  onboardingCompleted: boolean;

  @IsBoolean()
  profileCompleted: boolean;

  @IsBoolean()
  financialDataCompleted: boolean;

  @IsBoolean()
  hasProfile: boolean;

  @IsBoolean()
  hasFinancialData: boolean;
}

export class SkipOnboardingDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
