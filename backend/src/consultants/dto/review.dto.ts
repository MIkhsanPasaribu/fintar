import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class ReviewDto {
  @ApiProperty({ example: 5, description: "Rating 1-5" })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example:
      "Konsultan sangat membantu dan memberikan advice yang praktis untuk perencanaan keuangan saya.",
    description: "Komentar review",
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
