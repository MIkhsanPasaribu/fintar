import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { SubmitSUSDto, SUSStatisticsDto, SUSResponseDto } from "./dto/sus.dto";

/**
 * SUS (System Usability Scale) Service
 *
 * Implements standard SUS scoring methodology:
 * - Odd questions (1,3,5,7,9): score = (response - 1)
 * - Even questions (2,4,6,8,10): score = (5 - response)
 * - Total SUS score = sum of all scores × 2.5 (converts to 0-100 scale)
 *
 * SUS Grade System:
 * - A+ (93-100): Excellent
 * - A (86-92): Very Good
 * - B (79-85): Good
 * - C (69-78): Okay/Marginal
 * - D (51-68): Poor
 * - F (0-50): Awful
 */
@Injectable()
export class SUSService {
  private readonly logger = new Logger(SUSService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate SUS Score using standard algorithm
   * @param responses - Individual responses to 10 SUS questions (1-5 scale)
   * @returns Calculated SUS score (0-100 scale)
   */
  calculateSUSScore(responses: {
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
  }): number {
    // Odd questions (positive statements): score = response - 1
    const oddScore =
      responses.q1 -
      1 +
      (responses.q3 - 1) +
      (responses.q5 - 1) +
      (responses.q7 - 1) +
      (responses.q9 - 1);

    // Even questions (negative statements): score = 5 - response
    const evenScore =
      5 -
      responses.q2 +
      (5 - responses.q4) +
      (5 - responses.q6) +
      (5 - responses.q8) +
      (5 - responses.q10);

    // Total SUS score = sum × 2.5 (converts to 0-100 scale)
    const totalScore = (oddScore + evenScore) * 2.5;

    return Math.round(totalScore * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Determine SUS grade based on score
   * @param score - SUS score (0-100)
   * @returns Grade letter (F, D, C, B, A, A+)
   */
  getSUSGrade(score: number): string {
    if (score >= 93) return "A+";
    if (score >= 86) return "A";
    if (score >= 79) return "B";
    if (score >= 69) return "C";
    if (score >= 51) return "D";
    return "F";
  }

  /**
   * Submit SUS questionnaire response
   * @param userId - User ID
   * @param dto - SUS questionnaire responses
   * @returns Created SUS response with calculated score
   */
  async submitSUSResponse(
    userId: string,
    dto: SubmitSUSDto
  ): Promise<SUSResponseDto> {
    try {
      // Calculate SUS score
      const totalScore = this.calculateSUSScore({
        q1: dto.q1,
        q2: dto.q2,
        q3: dto.q3,
        q4: dto.q4,
        q5: dto.q5,
        q6: dto.q6,
        q7: dto.q7,
        q8: dto.q8,
        q9: dto.q9,
        q10: dto.q10,
      });

      // Save to database
      const susResponse = await this.prisma.sUSResponse.create({
        data: {
          userId,
          q1_frequency: dto.q1,
          q2_complexity: dto.q2,
          q3_ease: dto.q3,
          q4_support: dto.q4,
          q5_integration: dto.q5,
          q6_inconsistency: dto.q6,
          q7_learning: dto.q7,
          q8_cumbersome: dto.q8,
          q9_confidence: dto.q9,
          q10_learning_req: dto.q10,
          susScore: totalScore,
        },
      });

      this.logger.log(
        `SUS response submitted by user ${userId}, score: ${totalScore}`
      );

      return {
        id: susResponse.id,
        userId: susResponse.userId,
        sessionId: dto.sessionId,
        totalScore: susResponse.susScore,
        grade: this.getSUSGrade(susResponse.susScore),
        completedAt: susResponse.createdAt,
        responses: {
          q1: susResponse.q1_frequency,
          q2: susResponse.q2_complexity,
          q3: susResponse.q3_ease,
          q4: susResponse.q4_support,
          q5: susResponse.q5_integration,
          q6: susResponse.q6_inconsistency,
          q7: susResponse.q7_learning,
          q8: susResponse.q8_cumbersome,
          q9: susResponse.q9_confidence,
          q10: susResponse.q10_learning_req,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to submit SUS response for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get SUS response history for a user
   * @param userId - User ID
   * @returns Array of user's SUS responses
   */
  async getUserSUSHistory(userId: string): Promise<SUSResponseDto[]> {
    try {
      const responses = await this.prisma.sUSResponse.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return responses.map((r) => ({
        id: r.id,
        userId: r.userId,
        sessionId: "", // Session ID not stored in schema
        totalScore: r.susScore,
        grade: this.getSUSGrade(r.susScore),
        completedAt: r.createdAt,
        responses: {
          q1: r.q1_frequency,
          q2: r.q2_complexity,
          q3: r.q3_ease,
          q4: r.q4_support,
          q5: r.q5_integration,
          q6: r.q6_inconsistency,
          q7: r.q7_learning,
          q8: r.q8_cumbersome,
          q9: r.q9_confidence,
          q10: r.q10_learning_req,
        },
      }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch SUS history for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get SUS response by ID
   * @param id - SUS Response ID
   * @returns SUS response detail
   */
  async getSUSResponseById(id: string): Promise<SUSResponseDto> {
    try {
      const response = await this.prisma.sUSResponse.findUnique({
        where: { id },
      });

      if (!response) {
        throw new NotFoundException(`SUS response with ID ${id} not found`);
      }

      return {
        id: response.id,
        userId: response.userId,
        sessionId: "", // Session ID not stored in schema
        totalScore: response.susScore,
        grade: this.getSUSGrade(response.susScore),
        completedAt: response.createdAt,
        responses: {
          q1: response.q1_frequency,
          q2: response.q2_complexity,
          q3: response.q3_ease,
          q4: response.q4_support,
          q5: response.q5_integration,
          q6: response.q6_inconsistency,
          q7: response.q7_learning,
          q8: response.q8_cumbersome,
          q9: response.q9_confidence,
          q10: response.q10_learning_req,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch SUS response ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get aggregated SUS statistics
   * @returns Comprehensive SUS statistics
   */
  async getSUSStatistics(): Promise<SUSStatisticsDto> {
    try {
      const responses = await this.prisma.sUSResponse.findMany({
        select: { susScore: true },
      });

      if (responses.length === 0) {
        return {
          totalResponses: 0,
          averageScore: 0,
          medianScore: 0,
          minScore: 0,
          maxScore: 0,
          standardDeviation: 0,
          gradeDistribution: {
            F: 0,
            D: 0,
            C: 0,
            B: 0,
            A: 0,
            "A+": 0,
          },
          percentiles: {
            p25: 0,
            p50: 0,
            p75: 0,
            p90: 0,
          },
        };
      }

      const scores = responses.map((r) => r.susScore).sort((a, b) => a - b);

      // Calculate basic statistics
      const totalResponses = scores.length;
      const averageScore =
        scores.reduce((sum, score) => sum + score, 0) / totalResponses;
      const medianScore = this.calculateMedian(scores);
      const minScore = Math.min(...scores);
      const maxScore = Math.max(...scores);
      const standardDeviation = this.calculateStdDev(scores, averageScore);

      // Calculate grade distribution
      const gradeDistribution = {
        F: scores.filter((s) => s < 51).length,
        D: scores.filter((s) => s >= 51 && s < 69).length,
        C: scores.filter((s) => s >= 69 && s < 79).length,
        B: scores.filter((s) => s >= 79 && s < 86).length,
        A: scores.filter((s) => s >= 86 && s < 93).length,
        "A+": scores.filter((s) => s >= 93).length,
      };

      // Calculate percentiles
      const percentiles = {
        p25: this.calculatePercentile(scores, 25),
        p50: this.calculatePercentile(scores, 50),
        p75: this.calculatePercentile(scores, 75),
        p90: this.calculatePercentile(scores, 90),
      };

      this.logger.log(
        `SUS statistics calculated: avg=${averageScore.toFixed(2)}, n=${totalResponses}`
      );

      return {
        totalResponses,
        averageScore: Math.round(averageScore * 10) / 10,
        medianScore: Math.round(medianScore * 10) / 10,
        minScore: Math.round(minScore * 10) / 10,
        maxScore: Math.round(maxScore * 10) / 10,
        standardDeviation: Math.round(standardDeviation * 10) / 10,
        gradeDistribution,
        percentiles: {
          p25: Math.round(percentiles.p25 * 10) / 10,
          p50: Math.round(percentiles.p50 * 10) / 10,
          p75: Math.round(percentiles.p75 * 10) / 10,
          p90: Math.round(percentiles.p90 * 10) / 10,
        },
      };
    } catch (error) {
      this.logger.error("Failed to calculate SUS statistics:", error);
      throw error;
    }
  }

  /**
   * Calculate median of sorted array
   */
  private calculateMedian(sortedScores: number[]): number {
    const mid = Math.floor(sortedScores.length / 2);
    return sortedScores.length % 2 === 0
      ? (sortedScores[mid - 1] + sortedScores[mid]) / 2
      : sortedScores[mid];
  }

  /**
   * Calculate standard deviation
   */
  private calculateStdDev(scores: number[], mean: number): number {
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate percentile of sorted array
   */
  private calculatePercentile(
    sortedScores: number[],
    percentile: number
  ): number {
    const index = (percentile / 100) * (sortedScores.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) {
      return sortedScores[lower];
    }

    return sortedScores[lower] * (1 - weight) + sortedScores[upper] * weight;
  }

  /**
   * Delete SUS response (admin only)
   * @param id - SUS Response ID
   */
  async deleteSUSResponse(id: string): Promise<void> {
    try {
      const response = await this.prisma.sUSResponse.findUnique({
        where: { id },
      });

      if (!response) {
        throw new NotFoundException(`SUS response with ID ${id} not found`);
      }

      await this.prisma.sUSResponse.delete({
        where: { id },
      });

      this.logger.log(`SUS response ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete SUS response ${id}:`, error);
      throw error;
    }
  }
}
