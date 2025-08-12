import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  Min,
} from "class-validator";

export enum GoalType {
  SHORT_TERM = "SHORT_TERM", // < 1 year
  MEDIUM_TERM = "MEDIUM_TERM", // 1-5 years
  LONG_TERM = "LONG_TERM", // > 5 years
}

export enum GoalCategory {
  EMERGENCY_FUND = "EMERGENCY_FUND",
  HOUSE_PURCHASE = "HOUSE_PURCHASE",
  EDUCATION = "EDUCATION",
  RETIREMENT = "RETIREMENT",
  VACATION = "VACATION",
  VEHICLE = "VEHICLE",
  BUSINESS = "BUSINESS",
  DEBT_PAYOFF = "DEBT_PAYOFF",
  OTHER = "OTHER",
}

export enum GoalStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
}

export class FinancialGoalDto {
  @ApiProperty({ example: "Rumah Impian", description: "Goal name" })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Membeli rumah dengan cicilan yang terjangkau",
    description: "Goal description",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 500000000, description: "Target amount in IDR" })
  @IsNumber()
  @Min(1000)
  targetAmount: number;

  @ApiProperty({
    example: 50000000,
    description: "Current saved amount in IDR",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number = 0;

  @ApiProperty({ example: "2026-12-31", description: "Target completion date" })
  @IsDateString()
  targetDate: string;

  @ApiProperty({
    enum: GoalType,
    description: "Goal time horizon",
    example: GoalType.LONG_TERM,
  })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty({
    enum: GoalCategory,
    description: "Goal category",
    example: GoalCategory.HOUSE_PURCHASE,
  })
  @IsEnum(GoalCategory)
  category: GoalCategory;

  @ApiProperty({
    enum: GoalStatus,
    description: "Current goal status",
    example: GoalStatus.PLANNING,
    default: GoalStatus.PLANNING,
  })
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus = GoalStatus.PLANNING;

  @ApiProperty({ example: 5000000, description: "Monthly contribution amount" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyContribution?: number;

  @ApiProperty({ example: 1, description: "Priority level (1 = highest)" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  priority?: number = 1;

  @ApiProperty({ example: false, description: "Auto-save enabled" })
  @IsOptional()
  @IsBoolean()
  autoSave?: boolean = false;

  @ApiProperty({
    example: "Increase monthly contribution by 10% annually",
    description: "Achievement strategy",
  })
  @IsOptional()
  @IsString()
  strategy?: string;
}
