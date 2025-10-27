import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsBoolean, IsIn, Min } from "class-validator";

export class BudgetAdviceDto {
  @ApiProperty({
    description: "Monthly income in IDR",
    example: 5000000,
  })
  @IsNumber()
  @Min(0)
  income: number;

  @ApiProperty({
    description: "Monthly expenses in IDR",
    example: 4000000,
  })
  @IsNumber()
  @Min(0)
  expenses: number;
}

export class InvestmentAdviceDto {
  @ApiProperty({
    description: "User age",
    example: 28,
  })
  @IsNumber()
  @Min(18)
  age: number;

  @ApiProperty({
    description: "Monthly income in IDR",
    example: 5000000,
  })
  @IsNumber()
  @Min(0)
  monthlyIncome: number;

  @ApiProperty({
    description: "Risk tolerance level",
    enum: ["low", "moderate", "high"],
    example: "moderate",
  })
  @IsString()
  @IsIn(["low", "moderate", "high"])
  riskTolerance: "low" | "moderate" | "high";
}

export class EmergencyFundAdviceDto {
  @ApiProperty({
    description: "Monthly expenses in IDR",
    example: 4000000,
  })
  @IsNumber()
  @Min(0)
  monthlyExpenses: number;

  @ApiProperty({
    description: "Current savings in IDR",
    example: 10000000,
  })
  @IsNumber()
  @Min(0)
  currentSavings: number;
}

export class DebtAdviceDto {
  @ApiProperty({
    description: "Total debt amount in IDR",
    example: 15000000,
  })
  @IsNumber()
  @Min(0)
  totalDebt: number;

  @ApiProperty({
    description: "Monthly income in IDR",
    example: 5000000,
  })
  @IsNumber()
  @Min(0)
  monthlyIncome: number;
}

export class SavingsGoalAdviceDto {
  @ApiProperty({
    description: "Savings goal amount in IDR",
    example: 20000000,
  })
  @IsNumber()
  @Min(0)
  goalAmount: number;

  @ApiProperty({
    description: "Timeframe in months",
    example: 12,
  })
  @IsNumber()
  @Min(1)
  timeframeMonths: number;

  @ApiProperty({
    description: "Current savings in IDR",
    example: 5000000,
  })
  @IsNumber()
  @Min(0)
  currentSavings: number;
}

export class FinancialPlanningAdviceDto {
  @ApiProperty({
    description: "User age",
    example: 28,
  })
  @IsNumber()
  @Min(18)
  age: number;

  @ApiProperty({
    description: "Monthly income in IDR",
    example: 5000000,
  })
  @IsNumber()
  @Min(0)
  monthlyIncome: number;

  @ApiProperty({
    description: "Monthly expenses in IDR",
    example: 4000000,
  })
  @IsNumber()
  @Min(0)
  monthlyExpenses: number;

  @ApiProperty({
    description: "Whether user has emergency fund",
    example: true,
  })
  @IsBoolean()
  hasEmergencyFund: boolean;

  @ApiProperty({
    description: "Whether user has insurance",
    example: false,
  })
  @IsBoolean()
  hasInsurance: boolean;
}

export class GenericAdviceDto {
  @ApiProperty({
    description: "Financial question",
    example: "Bagaimana cara membuat budget bulanan?",
  })
  @IsString()
  question: string;
}

export class AdviceResponseDto {
  @ApiProperty({
    description: "Financial advice text",
    example: "Tingkat tabungan Anda sudah cukup baik...",
  })
  advice: string;

  @ApiProperty({
    description: "Source of advice",
    example: "rule-based",
  })
  source: string;

  @ApiProperty({
    description: "Timestamp of advice generation",
    example: "2025-01-13T10:30:00Z",
  })
  timestamp: string;
}
