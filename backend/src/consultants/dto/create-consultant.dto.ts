import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsDecimal,
  Min,
  Max,
} from "class-validator";

export class CreateConsultantDto {
  @ApiProperty({
    example: "Perencanaan Keuangan",
    description: "Area spesialisasi",
  })
  @IsString()
  specialization: string;

  @ApiProperty({ example: 5, description: "Pengalaman dalam tahun" })
  @IsNumber()
  @Min(0)
  @Max(50)
  experience: number;

  @ApiProperty({
    example: ["CFP", "QWP", "RFP"],
    description: "Sertifikasi yang dimiliki",
  })
  @IsArray()
  @IsString({ each: true })
  certification: string[];

  @ApiProperty({ example: 150000, description: "Tarif per jam dalam IDR" })
  @IsNumber()
  @Min(50000)
  @Max(5000000)
  hourlyRate: number;

  @ApiProperty({
    example:
      "Konsultan keuangan berpengalaman dengan fokus pada perencanaan pensiun dan investasi.",
    description: "Bio konsultan",
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: "Jakarta Selatan", required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: -6.2088, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 106.8456, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    example: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "10:00", end: "15:00", available: false },
      sunday: { start: "10:00", end: "15:00", available: false },
    },
    description: "Jadwal ketersediaan",
    required: false,
  })
  @IsOptional()
  @IsObject()
  availability?: Record<string, any>;
}

export class ConsultantSearchDto {
  @ApiProperty({ example: "Perencanaan Keuangan", required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ example: "Jakarta", required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 2,
    required: false,
    description: "Minimum pengalaman dalam tahun",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minExperience?: number;

  @ApiProperty({
    example: 200000,
    required: false,
    description: "Maksimum tarif per jam",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHourlyRate?: number;

  @ApiProperty({ example: 4.0, required: false, description: "Minimum rating" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiProperty({
    example: true,
    required: false,
    description: "Hanya konsultan terverifikasi",
  })
  @IsOptional()
  @IsBoolean()
  verifiedOnly?: boolean;

  @ApiProperty({ example: 10, required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ example: 0, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    example: "rating",
    required: false,
    enum: ["rating", "experience", "hourlyRate", "newest"],
  })
  @IsOptional()
  @IsString()
  sortBy?: "rating" | "experience" | "hourlyRate" | "newest" = "rating";
}
