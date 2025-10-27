import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from "class-validator";
import { ComparisonWinner } from "@prisma/client";

export class RunComparisonDto {
  @ApiProperty({
    description: "Question to ask both AI and baseline systems",
    example: "Bagaimana cara membuat budget bulanan yang efektif?",
  })
  @IsString()
  questionText: string;

  @ApiProperty({
    description: "Optional question ID for tracking",
    example: "benchmark-q-001",
    required: false,
  })
  @IsString()
  @IsOptional()
  questionId?: string;

  @ApiProperty({
    description: "Optional user ID (defaults to authenticated user)",
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;
}

export class ComparisonScoresDto {
  @ApiProperty({ description: "Accuracy score (0-100)", example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @ApiProperty({ description: "Relevance score (0-100)", example: 90 })
  @IsNumber()
  @Min(0)
  @Max(100)
  relevance: number;

  @ApiProperty({ description: "Actionability score (0-100)", example: 88 })
  @IsNumber()
  @Min(0)
  @Max(100)
  actionability: number;

  @ApiProperty({ description: "Clarity score (0-100)", example: 92 })
  @IsNumber()
  @Min(0)
  @Max(100)
  clarity: number;

  @ApiProperty({ description: "Completeness score (0-100)", example: 87 })
  @IsNumber()
  @Min(0)
  @Max(100)
  completeness: number;

  @ApiProperty({ description: "Overall score (average)", example: 88.4 })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore: number;
}

export class ComparisonResultDto {
  @ApiProperty({ description: "Comparison result ID", example: "cmp_123abc" })
  id: string;

  @ApiProperty({
    description: "Question asked",
    example: "Bagaimana cara membuat budget?",
  })
  questionText: string;

  @ApiProperty({
    description: "AI system response",
    example: "Untuk membuat budget efektif...",
  })
  aiResponseText: string;

  @ApiProperty({
    description: "Baseline system response",
    example: "Budget dapat dibuat dengan...",
  })
  baselineResponseText: string;

  @ApiProperty({ description: "AI response time (ms)", example: 1523 })
  aiResponseTime: number;

  @ApiProperty({ description: "Baseline response time (ms)", example: 45 })
  baselineResponseTime: number;

  @ApiProperty({ description: "AI quality scores", type: ComparisonScoresDto })
  aiScores: ComparisonScoresDto;

  @ApiProperty({
    description: "Baseline quality scores",
    type: ComparisonScoresDto,
  })
  baselineScores: ComparisonScoresDto;

  @ApiProperty({
    description: "Comparison winner",
    enum: ComparisonWinner,
    example: ComparisonWinner.AI_WINS,
  })
  winner: ComparisonWinner;

  @ApiProperty({
    description: "Score difference (AI - Baseline)",
    example: 23.5,
  })
  scoreDifference: number;

  @ApiProperty({
    description: "Evaluator feedback/reasoning",
    example: "AI response provides more...",
  })
  evaluatorFeedback: string;

  @ApiProperty({ description: "Timestamp", example: "2025-01-13T10:30:00Z" })
  createdAt: Date;
}

export class ComparisonStatisticsDto {
  @ApiProperty({ description: "Total comparisons run", example: 150 })
  totalComparisons: number;

  @ApiProperty({ description: "Number of AI wins", example: 120 })
  aiWins: number;

  @ApiProperty({ description: "Number of baseline wins", example: 15 })
  baselineWins: number;

  @ApiProperty({ description: "Number of ties", example: 15 })
  ties: number;

  @ApiProperty({ description: "AI win rate percentage", example: 80.0 })
  aiWinRate: number;

  @ApiProperty({ description: "Average AI overall score", example: 86.3 })
  avgAiScore: number;

  @ApiProperty({ description: "Average baseline overall score", example: 62.8 })
  avgBaselineScore: number;

  @ApiProperty({ description: "Average score difference", example: 23.5 })
  avgScoreDifference: number;

  @ApiProperty({ description: "AI median score", example: 87.0 })
  medianAiScore: number;

  @ApiProperty({ description: "Baseline median score", example: 64.0 })
  medianBaselineScore: number;

  @ApiProperty({ description: "AI standard deviation", example: 8.2 })
  stdDevAiScore: number;

  @ApiProperty({ description: "Baseline standard deviation", example: 12.5 })
  stdDevBaselineScore: number;

  @ApiProperty({
    description: "Score breakdown by criteria",
    example: {
      accuracy: { ai: 85.2, baseline: 70.5 },
      relevance: { ai: 88.1, baseline: 65.3 },
      actionability: { ai: 86.7, baseline: 58.9 },
      clarity: { ai: 89.4, baseline: 72.1 },
      completeness: { ai: 84.9, baseline: 61.7 },
    },
  })
  scoresByCriteria: {
    accuracy: { ai: number; baseline: number };
    relevance: { ai: number; baseline: number };
    actionability: { ai: number; baseline: number };
    clarity: { ai: number; baseline: number };
    completeness: { ai: number; baseline: number };
  };

  @ApiProperty({ description: "Average AI response time (ms)", example: 1450 })
  avgAiResponseTime: number;

  @ApiProperty({
    description: "Average baseline response time (ms)",
    example: 42,
  })
  avgBaselineResponseTime: number;

  @ApiProperty({
    description: "Time period start",
    example: "2025-01-01T00:00:00Z",
  })
  periodStart?: Date;

  @ApiProperty({
    description: "Time period end",
    example: "2025-01-13T23:59:59Z",
  })
  periodEnd?: Date;
}

export class GetComparisonStatisticsDto {
  @ApiProperty({
    description: "Start date for statistics (ISO 8601)",
    required: false,
    example: "2025-01-01T00:00:00Z",
  })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: "End date for statistics (ISO 8601)",
    required: false,
    example: "2025-01-13T23:59:59Z",
  })
  @IsString()
  @IsOptional()
  endDate?: string;
}
