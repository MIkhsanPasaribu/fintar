import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Performance Metrics Service
 * Provides aggregated analytics for AI system performance monitoring
 */
@Injectable()
export class PerformanceMetricsService {
  private readonly logger = new Logger(PerformanceMetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get comprehensive performance metrics for a date range
   */
  async getPerformanceMetrics(startDate: Date, endDate: Date) {
    try {
      const [
        responseTimeStats,
        tokenUsageStats,
        successRateStats,
        errorDistribution,
        qualityScoreStats,
      ] = await Promise.all([
        this.getResponseTimeStats(startDate, endDate),
        this.getTokenUsageStats(startDate, endDate),
        this.getSuccessRateStats(startDate, endDate),
        this.getErrorDistribution(startDate, endDate),
        this.getQualityScoreStats(startDate, endDate),
      ]);

      return {
        dateRange: {
          start: startDate,
          end: endDate,
        },
        responseTime: responseTimeStats,
        tokenUsage: tokenUsageStats,
        successRate: successRateStats,
        errors: errorDistribution,
        qualityScores: qualityScoreStats,
      };
    } catch (error) {
      this.logger.error("Failed to get performance metrics:", error);
      throw error;
    }
  }

  /**
   * Get response time statistics (average, median, p95, p99)
   */
  async getResponseTimeStats(startDate: Date, endDate: Date) {
    try {
      const analytics = await this.prisma.aIAnalytics.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          action: "ai_response_generated",
          data: {
            path: ["processingTime"],
            not: null,
          },
        },
        select: {
          data: true,
        },
      });

      // Extract processing times
      const processingTimes = analytics
        .map((a) => (a.data as any)?.processingTime)
        .filter((time) => typeof time === "number" && time > 0)
        .sort((a, b) => a - b);

      if (processingTimes.length === 0) {
        return {
          average: 0,
          median: 0,
          p95: 0,
          p99: 0,
          min: 0,
          max: 0,
          count: 0,
        };
      }

      const average =
        processingTimes.reduce((sum, time) => sum + time, 0) /
        processingTimes.length;

      const median = this.calculatePercentile(processingTimes, 50);
      const p95 = this.calculatePercentile(processingTimes, 95);
      const p99 = this.calculatePercentile(processingTimes, 99);

      return {
        average: Math.round(average),
        median: Math.round(median),
        p95: Math.round(p95),
        p99: Math.round(p99),
        min: processingTimes[0],
        max: processingTimes[processingTimes.length - 1],
        count: processingTimes.length,
      };
    } catch (error) {
      this.logger.error("Failed to get response time stats:", error);
      return {
        average: 0,
        median: 0,
        p95: 0,
        p99: 0,
        min: 0,
        max: 0,
        count: 0,
      };
    }
  }

  /**
   * Get token usage statistics
   */
  async getTokenUsageStats(startDate: Date, endDate: Date) {
    try {
      const analytics = await this.prisma.aIAnalytics.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          action: "ai_response_generated",
          data: {
            path: ["tokenUsage"],
            not: null,
          },
        },
        select: {
          data: true,
        },
      });

      let totalTokens = 0;
      let totalRequests = 0;

      analytics.forEach((a) => {
        const tokenUsage = (a.data as any)?.tokenUsage;
        if (typeof tokenUsage === "number" && tokenUsage > 0) {
          totalTokens += tokenUsage;
          totalRequests++;
        }
      });

      return {
        totalTokens,
        totalRequests,
        averageTokensPerRequest:
          totalRequests > 0 ? Math.round(totalTokens / totalRequests) : 0,
        estimatedCost: this.estimateTokenCost(totalTokens),
      };
    } catch (error) {
      this.logger.error("Failed to get token usage stats:", error);
      return {
        totalTokens: 0,
        totalRequests: 0,
        averageTokensPerRequest: 0,
        estimatedCost: 0,
      };
    }
  }

  /**
   * Get success rate statistics
   */
  async getSuccessRateStats(startDate: Date, endDate: Date) {
    try {
      const totalRequests = await this.prisma.aIAnalytics.count({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          action: {
            in: ["ai_response_generated", "ai_response_failed"],
          },
        },
      });

      const successfulRequests = await this.prisma.aIAnalytics.count({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          action: "ai_response_generated",
          data: {
            path: ["success"],
            equals: true,
          },
        },
      });

      const failedRequests = totalRequests - successfulRequests;
      const successRate =
        totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

      return {
        totalRequests,
        successfulRequests,
        failedRequests,
        successRate: Math.round(successRate * 100) / 100, // 2 decimal places
      };
    } catch (error) {
      this.logger.error("Failed to get success rate stats:", error);
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        successRate: 0,
      };
    }
  }

  /**
   * Get error distribution by type
   */
  async getErrorDistribution(startDate: Date, endDate: Date) {
    try {
      const errors = await this.prisma.aIAnalytics.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          action: {
            in: ["ai_response_failed", "ai_quota_exceeded"],
          },
        },
        select: {
          action: true,
          data: true,
        },
      });

      const errorTypes: { [key: string]: number } = {};

      errors.forEach((error) => {
        const errorMessage = (error.data as any)?.error || "Unknown error";
        const errorType = this.categorizeError(errorMessage, error.action);

        errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
      });

      return Object.entries(errorTypes).map(([type, count]) => ({
        type,
        count,
      }));
    } catch (error) {
      this.logger.error("Failed to get error distribution:", error);
      return [];
    }
  }

  /**
   * Get quality score statistics from QualityEvaluation table
   */
  async getQualityScoreStats(startDate: Date, endDate: Date) {
    try {
      const evaluations = await this.prisma.qualityEvaluation.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: "COMPLETED",
        },
        select: {
          overallScore: true,
          accuracy: true,
          relevance: true,
          actionability: true,
          clarity: true,
          completeness: true,
          personalization: true,
        },
      });

      if (evaluations.length === 0) {
        return {
          count: 0,
          averageOverallScore: 0,
          averageScores: {
            accuracy: 0,
            relevance: 0,
            actionability: 0,
            clarity: 0,
            completeness: 0,
            personalization: 0,
          },
        };
      }

      const sum = evaluations.reduce(
        (acc, evaluation) => ({
          overallScore: acc.overallScore + evaluation.overallScore,
          accuracy: acc.accuracy + evaluation.accuracy,
          relevance: acc.relevance + evaluation.relevance,
          actionability: acc.actionability + evaluation.actionability,
          clarity: acc.clarity + evaluation.clarity,
          completeness: acc.completeness + evaluation.completeness,
          personalization: acc.personalization + evaluation.personalization,
        }),
        {
          overallScore: 0,
          accuracy: 0,
          relevance: 0,
          actionability: 0,
          clarity: 0,
          completeness: 0,
          personalization: 0,
        }
      );

      const count = evaluations.length;

      return {
        count,
        averageOverallScore: Math.round((sum.overallScore / count) * 100) / 100,
        averageScores: {
          accuracy: Math.round((sum.accuracy / count) * 100) / 100,
          relevance: Math.round((sum.relevance / count) * 100) / 100,
          actionability: Math.round((sum.actionability / count) * 100) / 100,
          clarity: Math.round((sum.clarity / count) * 100) / 100,
          completeness: Math.round((sum.completeness / count) * 100) / 100,
          personalization:
            Math.round((sum.personalization / count) * 100) / 100,
        },
      };
    } catch (error) {
      this.logger.error("Failed to get quality score stats:", error);
      return {
        count: 0,
        averageOverallScore: 0,
        averageScores: {
          accuracy: 0,
          relevance: 0,
          actionability: 0,
          clarity: 0,
          completeness: 0,
          personalization: 0,
        },
      };
    }
  }

  /**
   * Get daily metrics for time-series charts
   */
  async getDailyMetrics(startDate: Date, endDate: Date) {
    try {
      const analytics = await this.prisma.aIAnalytics.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          action: {
            in: ["ai_response_generated", "ai_response_failed"],
          },
        },
        select: {
          timestamp: true,
          action: true,
          data: true,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      // Group by date
      const dailyData: {
        [date: string]: {
          date: string;
          requests: number;
          successful: number;
          failed: number;
          avgResponseTime: number;
          totalResponseTime: number;
          responseTimeCount: number;
        };
      } = {};

      analytics.forEach((item) => {
        const dateKey = item.timestamp.toISOString().split("T")[0];

        if (!dailyData[dateKey]) {
          dailyData[dateKey] = {
            date: dateKey,
            requests: 0,
            successful: 0,
            failed: 0,
            avgResponseTime: 0,
            totalResponseTime: 0,
            responseTimeCount: 0,
          };
        }

        dailyData[dateKey].requests++;

        if (item.action === "ai_response_generated") {
          const success = (item.data as any)?.success;
          if (success) {
            dailyData[dateKey].successful++;
          } else {
            dailyData[dateKey].failed++;
          }

          const processingTime = (item.data as any)?.processingTime;
          if (typeof processingTime === "number" && processingTime > 0) {
            dailyData[dateKey].totalResponseTime += processingTime;
            dailyData[dateKey].responseTimeCount++;
          }
        } else {
          dailyData[dateKey].failed++;
        }
      });

      // Calculate averages
      const dailyMetrics = Object.values(dailyData).map((day) => ({
        date: day.date,
        requests: day.requests,
        successful: day.successful,
        failed: day.failed,
        successRate:
          day.requests > 0
            ? Math.round((day.successful / day.requests) * 100)
            : 0,
        avgResponseTime:
          day.responseTimeCount > 0
            ? Math.round(day.totalResponseTime / day.responseTimeCount)
            : 0,
      }));

      return dailyMetrics;
    } catch (error) {
      this.logger.error("Failed to get daily metrics:", error);
      return [];
    }
  }

  /**
   * Helper: Calculate percentile from sorted array
   */
  private calculatePercentile(
    sortedArray: number[],
    percentile: number
  ): number {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) {
      return sortedArray[lower];
    }

    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }

  /**
   * Helper: Estimate token cost (Gemini 2.0 Flash pricing)
   * Free tier: First 1M tokens/month free
   * Paid: $0.075 per 1M input tokens, $0.30 per 1M output tokens
   * Assuming average 50/50 split: ~$0.1875 per 1M tokens
   */
  private estimateTokenCost(totalTokens: number): number {
    const costPer1MTokens = 0.1875; // Average cost
    return Math.round((totalTokens / 1000000) * costPer1MTokens * 100) / 100; // 2 decimal places
  }

  /**
   * Helper: Categorize error types
   */
  private categorizeError(errorMessage: string, action: string): string {
    if (action === "ai_quota_exceeded") {
      return "Quota Exceeded";
    }

    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes("timeout") || lowerError.includes("timed out")) {
      return "Timeout";
    }
    if (lowerError.includes("network") || lowerError.includes("connect")) {
      return "Network Error";
    }
    if (lowerError.includes("quota") || lowerError.includes("429")) {
      return "Rate Limit";
    }
    if (lowerError.includes("invalid") || lowerError.includes("validation")) {
      return "Validation Error";
    }
    if (lowerError.includes("parse") || lowerError.includes("json")) {
      return "Parse Error";
    }

    return "Other Error";
  }
}
