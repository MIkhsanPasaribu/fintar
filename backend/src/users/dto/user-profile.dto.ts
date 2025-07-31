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

export class UserProfileDto {
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
