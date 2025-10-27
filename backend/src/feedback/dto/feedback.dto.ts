import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Feedback Type Enum
 */
export enum FeedbackType {
  THUMBS_UP = "THUMBS_UP",
  THUMBS_DOWN = "THUMBS_DOWN",
  STAR_RATING = "STAR_RATING",
  REPORT_ISSUE = "REPORT_ISSUE",
}

/**
 * DTO for submitting user feedback
 */
export class SubmitFeedbackDto {
  @ApiProperty({
    description: "Chat message ID being rated",
    example: "cm1234567890",
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: "User ID (optional, can be inferred from JWT)",
    example: "user_123",
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: "Chat session ID (optional)",
    example: "session_456",
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiProperty({
    description: "Type of feedback",
    enum: FeedbackType,
    example: FeedbackType.THUMBS_UP,
  })
  @IsEnum(FeedbackType)
  @IsNotEmpty()
  feedbackType: FeedbackType;

  @ApiProperty({
    description: "Star rating (1-5, required if feedbackType is STAR_RATING)",
    minimum: 1,
    maximum: 5,
    example: 4,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({
    description: "Optional user comment",
    example: "Very helpful advice!",
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: "Issue description (required if feedbackType is REPORT_ISSUE)",
    example:
      "The investment recommendation seems incorrect for my risk profile",
    required: false,
  })
  @IsString()
  @IsOptional()
  issueDescription?: string;
}

/**
 * DTO for feedback statistics
 */
export class FeedbackStatsDto {
  @ApiProperty({
    description: "Total number of feedback submissions",
    example: 250,
  })
  totalFeedback: number;

  @ApiProperty({
    description: "Feedback breakdown by type",
    example: {
      THUMBS_UP: 180,
      THUMBS_DOWN: 20,
      STAR_RATING: 40,
      REPORT_ISSUE: 10,
    },
  })
  feedbackByType: {
    THUMBS_UP: number;
    THUMBS_DOWN: number;
    STAR_RATING: number;
    REPORT_ISSUE: number;
  };

  @ApiProperty({
    description: "Average star rating",
    example: 4.3,
  })
  averageStarRating: number;

  @ApiProperty({
    description: "Positive feedback percentage (thumbs up / total)",
    example: 85.5,
  })
  positiveFeedbackPercentage: number;

  @ApiProperty({
    description: "Number of reported issues",
    example: 10,
  })
  reportedIssuesCount: number;
}
