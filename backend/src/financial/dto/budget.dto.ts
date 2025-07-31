import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsObject,
  IsString,
  IsArray,
  Min,
} from "class-validator";

export class BudgetDto {
  @ApiProperty({ example: 15000000, description: "Target monthly income" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetIncome?: number;

  @ApiProperty({
    example: {
      housing: 5000000,
      food: 2000000,
      transportation: 1000000,
      utilities: 500000,
      entertainment: 800000,
      savings: 3000000,
      emergency: 1000000,
      others: 1700000,
    },
    description: "Budget allocation by category",
  })
  @IsOptional()
  @IsObject()
  allocation?: Record<string, number>;

  @ApiProperty({ example: 12, description: "Budget period in months" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  period?: number;

  @ApiProperty({
    example: ["Reduce dining out", "Find cheaper transportation"],
    description: "Cost-cutting strategies",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strategies?: string[];

  @ApiProperty({
    example: {
      savingsTarget: 5000000,
      emergencyFundTarget: 15000000,
      debtPayoffTarget: 2000000,
    },
    description: "Financial targets for the budget period",
  })
  @IsOptional()
  @IsObject()
  targets?: Record<string, number>;

  @ApiProperty({
    example: ["salary_increase", "side_business", "investment_returns"],
    description: "Expected income sources",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  incomeSources?: string[];
}
