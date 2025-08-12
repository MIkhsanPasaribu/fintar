import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from "class-validator";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export class CreateBookingDto {
  @ApiProperty({ example: "consultant-id-123", description: "ID konsultan" })
  @IsString()
  consultantId: string;

  @ApiProperty({
    example: "2024-02-15T10:00:00Z",
    description: "Jadwal konsultasi",
  })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({
    example: "Financial Planning",
    description: "Jenis layanan konsultasi",
  })
  @IsString()
  service: string;

  @ApiProperty({
    example: 60,
    description: "Durasi dalam menit",
    required: false,
    default: 60,
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(240)
  duration?: number = 60;

  @ApiProperty({
    example:
      "Saya ingin konsultasi mengenai perencanaan investasi untuk masa pensiun.",
    description: "Catatan tambahan",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingDto {
  @ApiProperty({ enum: BookingStatus, required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ example: "2024-02-15T14:00:00Z", required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ example: 90, required: false })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(240)
  duration?: number;

  @ApiProperty({
    example: "https://meet.google.com/abc-def-ghi",
    required: false,
  })
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiProperty({
    example:
      "Konsultasi berjalan dengan baik, klien mendapat insight yang berguna.",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
