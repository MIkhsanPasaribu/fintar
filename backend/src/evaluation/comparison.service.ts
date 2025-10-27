import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { GeminiService, FinancialContext } from "../common/ai/gemini.service";
import { RuleBasedAdvisorService } from "../baseline/rule-based-advisor.service";
import { ComparisonWinner } from "@prisma/client";
import {
  RunComparisonDto,
  ComparisonResultDto,
  ComparisonStatisticsDto,
  ComparisonScoresDto,
} from "./dto/comparison.dto";

@Injectable()
export class ComparisonService {
  private readonly logger = new Logger(ComparisonService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    private readonly baseline: RuleBasedAdvisorService
  ) {}

  /**
   * Run head-to-head comparison between AI and baseline systems
   */
  async runComparison(
    dto: RunComparisonDto,
    authenticatedUserId: string
  ): Promise<ComparisonResultDto> {
    const userId = dto.userId || authenticatedUserId;
    const questionId = dto.questionId || `q-${Date.now()}`;

    this.logger.log(
      `Running comparison for question: "${dto.questionText}" (user: ${userId})`
    );

    try {
      // Step 1: Get AI response
      const aiStartTime = Date.now();
      const aiResponse = await this.getAIResponse(dto.questionText, userId);
      const aiResponseTime = Date.now() - aiStartTime;

      this.logger.log(`AI response time: ${aiResponseTime}ms`);

      // Step 2: Get baseline response
      const baselineStartTime = Date.now();
      const baselineResponse = this.getBaselineResponse(dto.questionText);
      const baselineResponseTime = Date.now() - baselineStartTime;

      this.logger.log(`Baseline response time: ${baselineResponseTime}ms`);

      // Step 3: Evaluate both responses using LLM-as-judge
      const evaluation = await this.evaluateComparison(
        dto.questionText,
        aiResponse,
        baselineResponse
      );

      // Step 4: Determine winner
      const winner = this.determineWinner(
        evaluation.aiScores.overallScore,
        evaluation.baselineScores.overallScore
      );

      const scoreDifference =
        evaluation.aiScores.overallScore -
        evaluation.baselineScores.overallScore;

      // Step 5: Save comparison result to database
      const comparisonResult = await this.prisma.comparisonResult.create({
        data: {
          userId,
          questionId,
          questionText: dto.questionText,
          aiResponseText: aiResponse,
          aiSource: "gemini-2.0-flash",
          aiResponseTime,
          baselineResponseText: baselineResponse,
          baselineSource: "rule-based",
          baselineResponseTime,
          aiAccuracy: evaluation.aiScores.accuracy,
          aiRelevance: evaluation.aiScores.relevance,
          aiActionability: evaluation.aiScores.actionability,
          aiClarity: evaluation.aiScores.clarity,
          aiCompleteness: evaluation.aiScores.completeness,
          aiOverallScore: evaluation.aiScores.overallScore,
          baselineAccuracy: evaluation.baselineScores.accuracy,
          baselineRelevance: evaluation.baselineScores.relevance,
          baselineActionability: evaluation.baselineScores.actionability,
          baselineClarity: evaluation.baselineScores.clarity,
          baselineCompleteness: evaluation.baselineScores.completeness,
          baselineOverallScore: evaluation.baselineScores.overallScore,
          winner,
          scoreDifference,
          evaluatorFeedback: evaluation.feedback,
          evaluatorModel: "gemini-2.0-flash-exp",
        },
      });

      this.logger.log(
        `Comparison completed: ${winner} (AI: ${evaluation.aiScores.overallScore.toFixed(1)}, Baseline: ${evaluation.baselineScores.overallScore.toFixed(1)})`
      );

      return this.mapToDto(comparisonResult);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Error running comparison: ${errorMessage}`,
        errorStack
      );
      throw error;
    }
  }

  /**
   * Get AI response for a question
   */
  private async getAIResponse(
    question: string,
    userId: string
  ): Promise<string> {
    const context: FinancialContext = {
      userId,
      requestType: "comparison-test",
    };

    const response = await this.gemini.generateFinancialAdvice(
      context,
      question
    );
    return response.content;
  }

  /**
   * Get baseline (rule-based) response for a question
   */
  private getBaselineResponse(question: string): string {
    // Use generic advice method which does keyword matching
    return this.baseline.getGenericAdvice(question);
  }

  /**
   * Evaluate both responses using LLM-as-judge
   */
  private async evaluateComparison(
    question: string,
    aiResponse: string,
    baselineResponse: string
  ): Promise<{
    aiScores: ComparisonScoresDto;
    baselineScores: ComparisonScoresDto;
    feedback: string;
  }> {
    const evaluationPrompt = `
Anda adalah evaluator objektif untuk sistem financial advisor. Tugas Anda adalah membandingkan dua respons terhadap pertanyaan yang sama dan memberikan skor untuk masing-masing.

**Pertanyaan Pengguna:**
${question}

**Respons A (AI System):**
${aiResponse}

**Respons B (Baseline System):**
${baselineResponse}

**Kriteria Evaluasi (skor 0-100 untuk setiap kriteria):**

1. **Accuracy (0-100):** Seberapa akurat informasi finansial yang diberikan? Apakah ada kesalahan faktual?
2. **Relevance (0-100):** Seberapa relevan respons terhadap pertanyaan pengguna?
3. **Actionability (0-100):** Apakah respons memberikan langkah-langkah konkret yang dapat diambil pengguna?
4. **Clarity (0-100):** Seberapa jelas dan mudah dipahami bahasa yang digunakan?
5. **Completeness (0-100):** Apakah respons mencakup semua aspek penting dari pertanyaan?

**Format Respons JSON:**
\`\`\`json
{
  "aiScores": {
    "accuracy": <0-100>,
    "relevance": <0-100>,
    "actionability": <0-100>,
    "clarity": <0-100>,
    "completeness": <0-100>,
    "overallScore": <rata-rata>
  },
  "baselineScores": {
    "accuracy": <0-100>,
    "relevance": <0-100>,
    "actionability": <0-100>,
    "clarity": <0-100>,
    "completeness": <0-100>,
    "overallScore": <rata-rata>
  },
  "feedback": "<penjelasan singkat 2-3 kalimat tentang perbandingan kedua respons>"
}
\`\`\`

PENTING: Respons HANYA dalam format JSON di atas, tanpa teks tambahan.
`;

    try {
      const context: FinancialContext = {
        userId: "comparison-evaluator",
        requestType: "evaluation",
      };

      const response = await this.gemini.generateFinancialAdvice(
        context,
        evaluationPrompt
      );

      const evaluationResponse = response.content;

      // Parse JSON response
      const jsonMatch = evaluationResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to extract JSON from evaluation response");
      }

      const evaluation = JSON.parse(jsonMatch[0]);

      // Validate and return
      return {
        aiScores: {
          accuracy: evaluation.aiScores.accuracy,
          relevance: evaluation.aiScores.relevance,
          actionability: evaluation.aiScores.actionability,
          clarity: evaluation.aiScores.clarity,
          completeness: evaluation.aiScores.completeness,
          overallScore: evaluation.aiScores.overallScore,
        },
        baselineScores: {
          accuracy: evaluation.baselineScores.accuracy,
          relevance: evaluation.baselineScores.relevance,
          actionability: evaluation.baselineScores.actionability,
          clarity: evaluation.baselineScores.clarity,
          completeness: evaluation.baselineScores.completeness,
          overallScore: evaluation.baselineScores.overallScore,
        },
        feedback: evaluation.feedback,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Error evaluating comparison: ${errorMessage}`,
        errorStack
      );

      // Fallback: Return neutral scores if evaluation fails
      return {
        aiScores: {
          accuracy: 50,
          relevance: 50,
          actionability: 50,
          clarity: 50,
          completeness: 50,
          overallScore: 50,
        },
        baselineScores: {
          accuracy: 50,
          relevance: 50,
          actionability: 50,
          clarity: 50,
          completeness: 50,
          overallScore: 50,
        },
        feedback: "Evaluation failed, neutral scores assigned",
      };
    }
  }

  /**
   * Determine winner based on scores
   */
  private determineWinner(
    aiScore: number,
    baselineScore: number
  ): ComparisonWinner {
    const difference = aiScore - baselineScore;

    // Consider it a tie if difference is less than 5 points
    if (Math.abs(difference) < 5) {
      return ComparisonWinner.TIE;
    }

    return difference > 0
      ? ComparisonWinner.AI_WINS
      : ComparisonWinner.BASELINE_WINS;
  }

  /**
   * Get comparison result by ID
   */
  async getComparisonById(id: string): Promise<ComparisonResultDto> {
    const comparison = await this.prisma.comparisonResult.findUnique({
      where: { id },
    });

    if (!comparison) {
      throw new NotFoundException(`Comparison result with ID ${id} not found`);
    }

    return this.mapToDto(comparison);
  }

  /**
   * Get all comparison results for a user
   */
  async getUserComparisons(
    userId: string,
    limit: number = 50
  ): Promise<ComparisonResultDto[]> {
    const comparisons = await this.prisma.comparisonResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return comparisons.map((c) => this.mapToDto(c));
  }

  /**
   * Get comparison statistics
   */
  async getComparisonStatistics(
    startDate?: Date,
    endDate?: Date
  ): Promise<ComparisonStatisticsDto> {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const comparisons = await this.prisma.comparisonResult.findMany({ where });

    if (comparisons.length === 0) {
      return this.getEmptyStatistics(startDate, endDate);
    }

    // Calculate statistics
    const totalComparisons = comparisons.length;
    const aiWins = comparisons.filter(
      (c) => c.winner === ComparisonWinner.AI_WINS
    ).length;
    const baselineWins = comparisons.filter(
      (c) => c.winner === ComparisonWinner.BASELINE_WINS
    ).length;
    const ties = comparisons.filter(
      (c) => c.winner === ComparisonWinner.TIE
    ).length;

    const aiScores = comparisons.map((c) => c.aiOverallScore);
    const baselineScores = comparisons.map((c) => c.baselineOverallScore);

    const avgAiScore = this.calculateMean(aiScores);
    const avgBaselineScore = this.calculateMean(baselineScores);
    const avgScoreDifference = avgAiScore - avgBaselineScore;

    const medianAiScore = this.calculateMedian(aiScores);
    const medianBaselineScore = this.calculateMedian(baselineScores);

    const stdDevAiScore = this.calculateStdDev(aiScores);
    const stdDevBaselineScore = this.calculateStdDev(baselineScores);

    // Calculate scores by criteria
    const scoresByCriteria = {
      accuracy: {
        ai: this.calculateMean(comparisons.map((c) => c.aiAccuracy)),
        baseline: this.calculateMean(
          comparisons.map((c) => c.baselineAccuracy)
        ),
      },
      relevance: {
        ai: this.calculateMean(comparisons.map((c) => c.aiRelevance)),
        baseline: this.calculateMean(
          comparisons.map((c) => c.baselineRelevance)
        ),
      },
      actionability: {
        ai: this.calculateMean(comparisons.map((c) => c.aiActionability)),
        baseline: this.calculateMean(
          comparisons.map((c) => c.baselineActionability)
        ),
      },
      clarity: {
        ai: this.calculateMean(comparisons.map((c) => c.aiClarity)),
        baseline: this.calculateMean(comparisons.map((c) => c.baselineClarity)),
      },
      completeness: {
        ai: this.calculateMean(comparisons.map((c) => c.aiCompleteness)),
        baseline: this.calculateMean(
          comparisons.map((c) => c.baselineCompleteness)
        ),
      },
    };

    const avgAiResponseTime = this.calculateMean(
      comparisons.map((c) => c.aiResponseTime)
    );
    const avgBaselineResponseTime = this.calculateMean(
      comparisons.map((c) => c.baselineResponseTime)
    );

    return {
      totalComparisons,
      aiWins,
      baselineWins,
      ties,
      aiWinRate: (aiWins / totalComparisons) * 100,
      avgAiScore,
      avgBaselineScore,
      avgScoreDifference,
      medianAiScore,
      medianBaselineScore,
      stdDevAiScore,
      stdDevBaselineScore,
      scoresByCriteria,
      avgAiResponseTime,
      avgBaselineResponseTime,
      periodStart: startDate,
      periodEnd: endDate,
    };
  }

  /**
   * Helper: Calculate mean
   */
  private calculateMean(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / numbers.length) * 10) / 10; // Round to 1 decimal
  }

  /**
   * Helper: Calculate median
   */
  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Helper: Calculate standard deviation
   */
  private calculateStdDev(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = this.calculateMean(numbers);
    const squaredDiffs = numbers.map((val) => Math.pow(val - mean, 2));
    const variance = this.calculateMean(squaredDiffs);
    return Math.round(Math.sqrt(variance) * 10) / 10; // Round to 1 decimal
  }

  /**
   * Helper: Get empty statistics
   */
  private getEmptyStatistics(
    startDate?: Date,
    endDate?: Date
  ): ComparisonStatisticsDto {
    return {
      totalComparisons: 0,
      aiWins: 0,
      baselineWins: 0,
      ties: 0,
      aiWinRate: 0,
      avgAiScore: 0,
      avgBaselineScore: 0,
      avgScoreDifference: 0,
      medianAiScore: 0,
      medianBaselineScore: 0,
      stdDevAiScore: 0,
      stdDevBaselineScore: 0,
      scoresByCriteria: {
        accuracy: { ai: 0, baseline: 0 },
        relevance: { ai: 0, baseline: 0 },
        actionability: { ai: 0, baseline: 0 },
        clarity: { ai: 0, baseline: 0 },
        completeness: { ai: 0, baseline: 0 },
      },
      avgAiResponseTime: 0,
      avgBaselineResponseTime: 0,
      periodStart: startDate,
      periodEnd: endDate,
    };
  }

  /**
   * Helper: Map Prisma model to DTO
   */
  private mapToDto(comparison: any): ComparisonResultDto {
    return {
      id: comparison.id,
      questionText: comparison.questionText,
      aiResponseText: comparison.aiResponseText,
      baselineResponseText: comparison.baselineResponseText,
      aiResponseTime: comparison.aiResponseTime,
      baselineResponseTime: comparison.baselineResponseTime,
      aiScores: {
        accuracy: comparison.aiAccuracy,
        relevance: comparison.aiRelevance,
        actionability: comparison.aiActionability,
        clarity: comparison.aiClarity,
        completeness: comparison.aiCompleteness,
        overallScore: comparison.aiOverallScore,
      },
      baselineScores: {
        accuracy: comparison.baselineAccuracy,
        relevance: comparison.baselineRelevance,
        actionability: comparison.baselineActionability,
        clarity: comparison.baselineClarity,
        completeness: comparison.baselineCompleteness,
        overallScore: comparison.baselineOverallScore,
      },
      winner: comparison.winner,
      scoreDifference: comparison.scoreDifference,
      evaluatorFeedback: comparison.evaluatorFeedback,
      createdAt: comparison.createdAt,
    };
  }

  /**
   * Get raw comparison data for statistical analysis
   */
  async getRawComparisons(startDate?: Date, endDate?: Date): Promise<any[]> {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    return this.prisma.comparisonResult.findMany({ where });
  }
}
