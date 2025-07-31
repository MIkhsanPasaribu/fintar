import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsObject,
  IsString,
  IsArray,
  IsEnum,
  Min,
  Max,
} from "class-validator";
import { RiskLevel } from "./financial-data.dto";

export enum InvestmentType {
  SAHAM = "SAHAM",
  REKSADANA = "REKSADANA",
  OBLIGASI = "OBLIGASI",
  DEPOSITO = "DEPOSITO",
  EMAS = "EMAS",
  PROPERTI = "PROPERTI",
  CRYPTOCURRENCY = "CRYPTOCURRENCY",
  P2P_LENDING = "P2P_LENDING",
}

export class InvestmentPlanDto {
  @ApiProperty({
    example: 10000000,
    description: "Total investment amount in IDR",
  })
  @IsNumber()
  @Min(100000)
  totalAmount: number;

  @ApiProperty({
    enum: RiskLevel,
    description: "Investment risk tolerance",
    example: RiskLevel.MODERATE,
  })
  @IsEnum(RiskLevel)
  riskTolerance: RiskLevel;

  @ApiProperty({ example: 24, description: "Investment duration in months" })
  @IsNumber()
  @Min(1)
  @Max(600) // Max 50 years
  durationMonths: number;

  @ApiProperty({
    example: {
      [InvestmentType.SAHAM]: 40,
      [InvestmentType.REKSADANA]: 30,
      [InvestmentType.OBLIGASI]: 20,
      [InvestmentType.DEPOSITO]: 10,
    },
    description: "Investment allocation percentage by type",
  })
  @IsOptional()
  @IsObject()
  allocation?: Record<InvestmentType, number>;

  @ApiProperty({
    example: ["monthly_growth", "dividend_income", "capital_appreciation"],
    description: "Investment objectives",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  objectives?: string[];

  @ApiProperty({
    example: "retirement",
    description: "Primary investment goal",
  })
  @IsOptional()
  @IsString()
  primaryGoal?: string;

  @ApiProperty({
    example: 12,
    description: "Expected annual return percentage",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  expectedReturn?: number;

  @ApiProperty({
    example: {
      monthlyContribution: 2000000,
      autoRebalance: true,
      taxOptimization: true,
    },
    description: "Investment strategy preferences",
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @ApiProperty({
    example: ["BBCA", "TLKM", "ASII"],
    description: "Preferred stock symbols (for stock investments)",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredStocks?: string[];
}
