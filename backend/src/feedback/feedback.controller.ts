import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FeedbackService } from "./feedback.service";
import { SubmitFeedbackDto } from "./dto/feedback.dto";

/**
 * Feedback Controller
 * REST API endpoints for user feedback system
 */
@ApiTags("Feedback")
@ApiBearerAuth()
@Controller("feedback")
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * Submit feedback for a chat message
   */
  @Post()
  @ApiOperation({
    summary: "Submit feedback",
    description:
      "Submit user feedback for a chat message (thumbs up/down, star rating, report issue)",
  })
  @ApiResponse({
    status: 201,
    description: "Feedback submitted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid feedback data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
  })
  async submitFeedback(@Body() dto: SubmitFeedbackDto, @Request() req: any) {
    const userId = req.user.userId;
    return this.feedbackService.submitFeedback(dto, userId);
  }

  /**
   * Get feedback for a specific message
   */
  @Get("message/:messageId")
  @ApiOperation({
    summary: "Get feedback for message",
    description: "Get all feedback submissions for a specific chat message",
  })
  @ApiParam({
    name: "messageId",
    description: "Chat message ID",
    example: "cm1234567890",
  })
  @ApiResponse({
    status: 200,
    description: "Feedback retrieved successfully",
  })
  async getFeedbackByMessage(@Param("messageId") messageId: string) {
    return this.feedbackService.getFeedbackByMessage(messageId);
  }

  /**
   * Get user's feedback history
   */
  @Get("user/:userId")
  @ApiOperation({
    summary: "Get user feedback history",
    description: "Get all feedback submitted by a specific user",
  })
  @ApiParam({
    name: "userId",
    description: "User ID",
    example: "user_123",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of feedback items to return",
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: "Feedback history retrieved successfully",
  })
  async getFeedbackByUser(
    @Param("userId") userId: string,
    @Query("limit") limit?: number
  ) {
    return this.feedbackService.getFeedbackByUser(
      userId,
      limit ? parseInt(limit.toString()) : 50
    );
  }

  /**
   * Get feedback statistics
   */
  @Get("stats")
  @ApiOperation({
    summary: "Get feedback statistics",
    description:
      "Get aggregated feedback statistics (total, by type, average ratings)",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date for stats (ISO 8601)",
    example: "2025-10-01T00:00:00Z",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date for stats (ISO 8601)",
    example: "2025-10-21T23:59:59Z",
  })
  @ApiResponse({
    status: 200,
    description: "Feedback statistics retrieved successfully",
  })
  async getFeedbackStats(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;

    return this.feedbackService.getFeedbackStats(startDate, endDate);
  }

  /**
   * Get reported issues (admin)
   */
  @Get("issues")
  @ApiOperation({
    summary: "Get reported issues",
    description: "Get all reported issues (admin only)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of issues to return",
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: "Reported issues retrieved successfully",
  })
  async getReportedIssues(@Query("limit") limit?: number) {
    return this.feedbackService.getReportedIssues(
      limit ? parseInt(limit.toString()) : 50
    );
  }

  /**
   * Delete feedback (admin)
   */
  @Delete(":id")
  @ApiOperation({
    summary: "Delete feedback",
    description: "Delete a feedback submission (admin only)",
  })
  @ApiParam({
    name: "id",
    description: "Feedback ID",
    example: "feedback_123",
  })
  @ApiResponse({
    status: 200,
    description: "Feedback deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Feedback not found",
  })
  async deleteFeedback(@Param("id") id: string) {
    return this.feedbackService.deleteFeedback(id);
  }
}
