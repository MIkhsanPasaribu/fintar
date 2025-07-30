import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
} from "class-validator";
import { Transform } from "class-transformer";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum RiskLevel {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  AGGRESSIVE = "AGGRESSIVE",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export class PersonalInfoDto {
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

  @IsOptional()
  @IsString()
  phone?: string;

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
}

export class FinancialInfoDto {
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
}

export class OnboardingStepDto {
  @IsBoolean()
  completed: boolean;
}

export class OnboardingStatusResponseDto {
  onboardingCompleted: boolean;
  profileCompleted: boolean;
  financialDataCompleted: boolean;
  hasProfile: boolean;
  hasFinancialData: boolean;
}
