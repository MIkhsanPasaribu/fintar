import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsObject,
  IsString,
  Min,
} from "class-validator";

export enum RiskLevel {
  CONSERVATIVE = "CONSERVATIVE",
  MODERATE = "MODERATE",
  AGGRESSIVE = "AGGRESSIVE",
}

export class FinancialDataDto {
  @ApiProperty({ example: 15000000, description: "Monthly income in IDR" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyIncome?: number;

  @ApiProperty({ example: 8000000, description: "Monthly expenses in IDR" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyExpenses?: number;

  @ApiProperty({ example: 50000000, description: "Current savings in IDR" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentSavings?: number;

  @ApiProperty({ example: 10000000, description: "Current debt in IDR" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentDebt?: number;

  @ApiProperty({
    example: 30000000,
    description: "Emergency fund amount in IDR",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  emergencyFundAmount?: number;

  @ApiProperty({
    example: ["Beli rumah", "Dana pensiun", "Pendidikan anak"],
    description: "List of financial goals",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  financialGoals?: string[];

  @ApiProperty({
    enum: RiskLevel,
    description: "Risk tolerance level",
    example: RiskLevel.MODERATE,
  })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskTolerance?: RiskLevel;

  @ApiProperty({
    example: "Pemula",
    description: "Investment experience level",
  })
  @IsOptional()
  @IsString()
  investmentExperience?: string;

  @ApiProperty({
    example: {
      saham: 20000000,
      reksadana: 15000000,
      deposito: 25000000,
    },
    description: "Current investments breakdown",
  })
  @IsOptional()
  @IsObject()
  currentInvestments?: Record<string, any>;

  @ApiProperty({
    example: {
      properti: 500000000,
      kendaraan: 200000000,
      investasi: 60000000,
    },
    description: "Assets breakdown",
  })
  @IsOptional()
  @IsObject()
  assets?: Record<string, any>;

  @ApiProperty({
    example: {
      kpr: 300000000,
      kta: 50000000,
      kartu_kredit: 10000000,
    },
    description: "Liabilities breakdown",
  })
  @IsOptional()
  @IsObject()
  liabilities?: Record<string, any>;

  @ApiProperty({
    example: {
      jiwa: true,
      kesehatan: true,
      kendaraan: true,
      properti: false,
    },
    description: "Insurance coverage",
  })
  @IsOptional()
  @IsObject()
  insurance?: Record<string, any>;
}
