import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Quality Evaluation Criteria (LLM-as-a-Judge)
 * Evaluates AI response quality across 6 dimensions
 */
export class QualityEvaluationCriteria {
  @ApiProperty({
    description: "Accuracy: Financial information correctness (0-100)",
    minimum: 0,
    maximum: 100,
    example: 85,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  accuracy: number;

  @ApiProperty({
    description: "Relevance: Answer addresses user question (0-100)",
    minimum: 0,
    maximum: 100,
    example: 90,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  relevance: number;

  @ApiProperty({
    description: "Actionability: Provides concrete steps (0-100)",
    minimum: 0,
    maximum: 100,
    example: 80,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  actionability: number;

  @ApiProperty({
    description: "Clarity: Easy to understand language (0-100)",
    minimum: 0,
    maximum: 100,
    example: 95,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  clarity: number;

  @ApiProperty({
    description: "Completeness: Covers all aspects of question (0-100)",
    minimum: 0,
    maximum: 100,
    example: 88,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  completeness: number;

  @ApiProperty({
    description: "Personalization: Tailored to user context (0-100)",
    minimum: 0,
    maximum: 100,
    example: 92,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  personalization: number;
}

/**
 * Complete Evaluation Result
 */
export class QualityEvaluationResult {
  @ApiProperty({
    description: "Chat message ID being evaluated",
    example: "cm1234567890",
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: "User ID who received the response",
    example: "user_123",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "Quality criteria scores",
    type: QualityEvaluationCriteria,
  })
  criteria: QualityEvaluationCriteria;

  @ApiProperty({
    description: "Overall quality score (average of all criteria)",
    minimum: 0,
    maximum: 100,
    example: 88.3,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore: number;

  @ApiProperty({
    description: "Evaluator explanation/reasoning",
    example:
      "The response accurately addresses budgeting concerns with clear, actionable steps...",
  })
  @IsString()
  evaluatorFeedback: string;

  @ApiProperty({
    description: "Model used for evaluation",
    example: "gemini-2.0-flash-exp",
  })
  @IsString()
  evaluatorModel: string;
}

/**
 * DTO for creating a new evaluation
 */
export class CreateEvaluationDto {
  @ApiProperty({
    description: "Chat message ID to evaluate",
    example: "cm1234567890",
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: "User ID (optional, can be inferred from message)",
    example: "user_123",
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: "Chat session ID (optional, for analytics)",
    example: "session_456",
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId?: string;
}

/**
 * Evaluation Statistics Response
 */
export class EvaluationStatisticsDto {
  @ApiProperty({
    description: "Total number of evaluations",
    example: 150,
  })
  totalEvaluations: number;

  @ApiProperty({
    description: "Average overall score",
    example: 87.5,
  })
  averageScore: number;

  @ApiProperty({
    description: "Average scores per criterion",
    example: {
      accuracy: 85.2,
      relevance: 89.1,
      actionability: 82.5,
      clarity: 93.4,
      completeness: 86.7,
      personalization: 88.1,
    },
  })
  averageScoresByCriteria: {
    accuracy: number;
    relevance: number;
    actionability: number;
    clarity: number;
    completeness: number;
    personalization: number;
  };

  @ApiProperty({
    description: "Date range for statistics",
    example: {
      startDate: "2025-10-01T00:00:00Z",
      endDate: "2025-10-21T23:59:59Z",
    },
  })
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Enum for evaluation status
 */
export enum EvaluationStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * Query parameters for fetching evaluations
 */
export class GetEvaluationsQueryDto {
  @ApiProperty({
    description: "User ID filter",
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: "Minimum score filter",
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  minScore?: number;

  @ApiProperty({
    description: "Maximum score filter",
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  maxScore?: number;

  @ApiProperty({
    description: "Evaluation status filter",
    required: false,
    enum: EvaluationStatus,
  })
  @IsEnum(EvaluationStatus)
  @IsOptional()
  status?: EvaluationStatus;

  @ApiProperty({
    description: "Page number (for pagination)",
    required: false,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Items per page",
    required: false,
    default: 20,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;
}
