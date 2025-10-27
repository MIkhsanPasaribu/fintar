import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, Min, Max, IsNotEmpty } from "class-validator";

/**
 * DTO untuk submit SUS Questionnaire Response
 * System Usability Scale (SUS) - 10 pertanyaan standar dengan Likert scale 1-5
 */
export class SubmitSUSDto {
  @ApiProperty({
    description: "Session ID dari chat session yang dievaluasi",
    example: "clxyz123abc456",
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: "Q1: I think that I would like to use this system frequently",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q1: number;

  @ApiProperty({
    description: "Q2: I found the system unnecessarily complex",
    minimum: 1,
    maximum: 5,
    example: 2,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q2: number;

  @ApiProperty({
    description: "Q3: I thought the system was easy to use",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q3: number;

  @ApiProperty({
    description:
      "Q4: I think that I would need the support of a technical person to be able to use this system",
    minimum: 1,
    maximum: 5,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q4: number;

  @ApiProperty({
    description:
      "Q5: I found the various functions in this system were well integrated",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q5: number;

  @ApiProperty({
    description:
      "Q6: I thought there was too much inconsistency in this system",
    minimum: 1,
    maximum: 5,
    example: 2,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q6: number;

  @ApiProperty({
    description:
      "Q7: I would imagine that most people would learn to use this system very quickly",
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q7: number;

  @ApiProperty({
    description: "Q8: I found the system very cumbersome to use",
    minimum: 1,
    maximum: 5,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q8: number;

  @ApiProperty({
    description: "Q9: I felt very confident using the system",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q9: number;

  @ApiProperty({
    description:
      "Q10: I needed to learn a lot of things before I could get going with this system",
    minimum: 1,
    maximum: 5,
    example: 2,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  q10: number;
}

/**
 * DTO untuk SUS Statistics Response
 */
export class SUSStatisticsDto {
  @ApiProperty({
    description: "Total jumlah SUS responses yang sudah disubmit",
    example: 45,
  })
  totalResponses: number;

  @ApiProperty({
    description: "Average SUS score (0-100 scale)",
    example: 78.5,
  })
  averageScore: number;

  @ApiProperty({
    description: "Median SUS score",
    example: 80.0,
  })
  medianScore: number;

  @ApiProperty({
    description: "Minimum SUS score",
    example: 45.0,
  })
  minScore: number;

  @ApiProperty({
    description: "Maximum SUS score",
    example: 97.5,
  })
  maxScore: number;

  @ApiProperty({
    description: "Standard deviation of SUS scores",
    example: 12.3,
  })
  standardDeviation: number;

  @ApiProperty({
    description: "Distribution by SUS grade (F, D, C, B, A, A+)",
    example: {
      F: 2, // 0-50
      D: 5, // 51-68
      C: 10, // 69-78
      B: 15, // 79-85
      A: 10, // 86-92
      "A+": 3, // 93-100
    },
  })
  gradeDistribution: Record<string, number>;

  @ApiProperty({
    description: "Percentile distribution (25th, 50th, 75th, 90th)",
    example: {
      p25: 70.0,
      p50: 80.0,
      p75: 87.5,
      p90: 92.5,
    },
  })
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

/**
 * DTO untuk SUS Response object (return dari API)
 */
export class SUSResponseDto {
  @ApiProperty({
    description: "SUS Response ID",
    example: "clxyz789def012",
  })
  id: string;

  @ApiProperty({
    description: "User ID",
    example: "cluser123abc456",
  })
  userId: string;

  @ApiProperty({
    description: "Session ID",
    example: "clsess456def789",
  })
  sessionId: string;

  @ApiProperty({
    description: "Calculated SUS score (0-100 scale)",
    example: 82.5,
  })
  totalScore: number;

  @ApiProperty({
    description: "SUS Grade berdasarkan score",
    example: "A",
  })
  grade: string;

  @ApiProperty({
    description: "Completed timestamp",
    example: "2025-10-21T10:30:00.000Z",
  })
  completedAt: Date;

  @ApiProperty({
    description: "Individual question responses (q1-q10)",
    example: {
      q1: 4,
      q2: 2,
      q3: 4,
      q4: 1,
      q5: 4,
      q6: 2,
      q7: 5,
      q8: 1,
      q9: 4,
      q10: 2,
    },
  })
  responses: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
    q6: number;
    q7: number;
    q8: number;
    q9: number;
    q10: number;
  };
}
