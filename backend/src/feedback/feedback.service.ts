import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { SubmitFeedbackDto, FeedbackStatsDto } from "./dto/feedback.dto";

/**
 * Feedback Service
 * Handles user feedback submissions and statistics
 */
@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Submit user feedback for a chat message
   */
  async submitFeedback(dto: SubmitFeedbackDto, userId: string) {
    try {
      // Validate rating is provided for STAR_RATING type
      if (dto.feedbackType === "STAR_RATING" && !dto.rating) {
        throw new Error("Rating is required for STAR_RATING feedback type");
      }

      // Validate issue description for REPORT_ISSUE type
      if (dto.feedbackType === "REPORT_ISSUE" && !dto.issueDescription) {
        throw new Error(
          "Issue description is required for REPORT_ISSUE feedback type"
        );
      }

      // Create feedback
      const feedback = await this.prisma.userFeedback.create({
        data: {
          messageId: dto.messageId,
          userId: dto.userId || userId,
          sessionId: dto.sessionId,
          feedbackType: dto.feedbackType,
          rating: dto.rating,
          comment: dto.comment,
          issueDescription: dto.issueDescription,
        },
      });

      this.logger.log(
        `Feedback submitted: ${feedback.id} (${feedback.feedbackType}) by user ${userId}`
      );

      return feedback;
    } catch (error) {
      this.logger.error("Failed to submit feedback:", error);
      throw error;
    }
  }

  /**
   * Get feedback for a specific message
   */
  async getFeedbackByMessage(messageId: string) {
    try {
      const feedback = await this.prisma.userFeedback.findMany({
        where: {
          messageId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return feedback;
    } catch (error) {
      this.logger.error(
        `Failed to get feedback for message ${messageId}:`,
        error
      );
      return [];
    }
  }

  /**
   * Get feedback by user
   */
  async getFeedbackByUser(userId: string, limit: number = 50) {
    try {
      const feedback = await this.prisma.userFeedback.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      return feedback;
    } catch (error) {
      this.logger.error(`Failed to get feedback for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<FeedbackStatsDto> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      // Get all feedback
      const allFeedback = await this.prisma.userFeedback.findMany({
        where: whereClause,
      });

      // Count by type
      const feedbackByType = {
        THUMBS_UP: 0,
        THUMBS_DOWN: 0,
        STAR_RATING: 0,
        REPORT_ISSUE: 0,
      };

      let totalStarRatings = 0;
      let starRatingSum = 0;

      allFeedback.forEach((feedback) => {
        feedbackByType[feedback.feedbackType as keyof typeof feedbackByType]++;

        if (feedback.feedbackType === "STAR_RATING" && feedback.rating) {
          totalStarRatings++;
          starRatingSum += feedback.rating;
        }
      });

      // Calculate averages
      const averageStarRating =
        totalStarRatings > 0
          ? Math.round((starRatingSum / totalStarRatings) * 10) / 10
          : 0;

      const totalThumbsFeedback =
        feedbackByType.THUMBS_UP + feedbackByType.THUMBS_DOWN;
      const positiveFeedbackPercentage =
        totalThumbsFeedback > 0
          ? Math.round(
              (feedbackByType.THUMBS_UP / totalThumbsFeedback) * 100 * 10
            ) / 10
          : 0;

      return {
        totalFeedback: allFeedback.length,
        feedbackByType,
        averageStarRating,
        positiveFeedbackPercentage,
        reportedIssuesCount: feedbackByType.REPORT_ISSUE,
      };
    } catch (error) {
      this.logger.error("Failed to get feedback stats:", error);
      return {
        totalFeedback: 0,
        feedbackByType: {
          THUMBS_UP: 0,
          THUMBS_DOWN: 0,
          STAR_RATING: 0,
          REPORT_ISSUE: 0,
        },
        averageStarRating: 0,
        positiveFeedbackPercentage: 0,
        reportedIssuesCount: 0,
      };
    }
  }

  /**
   * Get reported issues (for admin review)
   */
  async getReportedIssues(limit: number = 50) {
    try {
      const issues = await this.prisma.userFeedback.findMany({
        where: {
          feedbackType: "REPORT_ISSUE",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      return issues;
    } catch (error) {
      this.logger.error("Failed to get reported issues:", error);
      return [];
    }
  }

  /**
   * Delete feedback (admin only)
   */
  async deleteFeedback(feedbackId: string) {
    try {
      const feedback = await this.prisma.userFeedback.findUnique({
        where: { id: feedbackId },
      });

      if (!feedback) {
        throw new NotFoundException("Feedback not found");
      }

      await this.prisma.userFeedback.delete({
        where: { id: feedbackId },
      });

      this.logger.log(`Feedback deleted: ${feedbackId}`);

      return { message: "Feedback deleted successfully" };
    } catch (error) {
      this.logger.error(`Failed to delete feedback ${feedbackId}:`, error);
      throw error;
    }
  }
}
