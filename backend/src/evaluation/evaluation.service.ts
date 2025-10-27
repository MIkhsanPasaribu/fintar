import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { GeminiService } from "../common/ai/gemini.service";
import {
  CreateEvaluationDto,
  QualityEvaluationResult,
  QualityEvaluationCriteria,
  EvaluationStatisticsDto,
  GetEvaluationsQueryDto,
  EvaluationStatus,
} from "./dto/evaluation.dto";

/**
 * Evaluation Service
 *
 * Implements LLM-as-a-Judge methodology for evaluating AI response quality.
 *
 * Evaluation Criteria:
 * 1. Accuracy - Financial information correctness
 * 2. Relevance - Answer addresses user question
 * 3. Actionability - Provides concrete steps
 * 4. Clarity - Easy to understand language
 * 5. Completeness - Covers all aspects
 * 6. Personalization - Tailored to user context
 *
 * @class EvaluationService
 */
@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService
  ) {}

  /**
   * Evaluate an AI response using LLM-as-a-Judge
   *
   * @param createEvaluationDto - Message ID and optional user ID
   * @returns QualityEvaluationResult with scores and feedback
   */
  async evaluateResponse(
    createEvaluationDto: CreateEvaluationDto
  ): Promise<QualityEvaluationResult> {
    const { messageId, userId: providedUserId } = createEvaluationDto;

    this.logger.log(`Starting evaluation for message: ${messageId}`);

    try {
      // 1. Fetch the chat message
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: {
          session: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      });

      if (!message) {
        throw new NotFoundException(`Chat message ${messageId} not found`);
      }

      // 2. Validate this is an AI response
      if (message.role !== "ASSISTANT") {
        throw new BadRequestException(
          "Can only evaluate AI assistant responses"
        );
      }

      const userId = providedUserId || message.session.userId;

      // 3. Get conversation context (previous messages)
      const conversationHistory = await this.prisma.chatMessage.findMany({
        where: {
          sessionId: message.sessionId,
          timestamp: {
            lte: message.timestamp,
          },
        },
        orderBy: { timestamp: "asc" },
        take: 10, // Last 10 messages for context
      });

      // 4. Build user context
      const userProfile = message.session.user.profile;
      const userContext = this.buildUserContext(userProfile);

      // 5. Get user question (last USER message before this response)
      const userQuestion = conversationHistory
        .filter((msg) => msg.role === "USER")
        .pop();

      if (!userQuestion) {
        throw new BadRequestException(
          "No user question found for this response"
        );
      }

      // 6. Call LLM-as-a-Judge for evaluation
      const evaluation = await this.callLLMJudge(
        userQuestion.content,
        message.content,
        userContext,
        conversationHistory
      );

      // 7. Calculate overall score
      const overallScore = this.calculateOverallScore(evaluation.criteria);

      const result: QualityEvaluationResult = {
        messageId,
        userId,
        criteria: evaluation.criteria,
        overallScore,
        evaluatorFeedback: evaluation.feedback,
        evaluatorModel: "gemini-2.0-flash-exp",
      };

      this.logger.log(
        `Evaluation completed for ${messageId}: Overall score ${overallScore.toFixed(2)}`
      );

      // 8. Save to database
      await this.saveEvaluation(result, message.sessionId);

      return result;
    } catch (error) {
      this.logger.error(`Error evaluating message ${messageId}:`, error);
      throw error;
    }
  }

  /**
   * Save evaluation result to database
   */
  private async saveEvaluation(
    result: QualityEvaluationResult,
    sessionId: string
  ): Promise<void> {
    try {
      await this.prisma.qualityEvaluation.create({
        data: {
          messageId: result.messageId,
          userId: result.userId,
          sessionId: sessionId,
          accuracy: result.criteria.accuracy,
          relevance: result.criteria.relevance,
          actionability: result.criteria.actionability,
          clarity: result.criteria.clarity,
          completeness: result.criteria.completeness,
          personalization: result.criteria.personalization,
          overallScore: result.overallScore,
          evaluatorFeedback: result.evaluatorFeedback,
          evaluatorModel: result.evaluatorModel,
          status: "COMPLETED",
        },
      });

      this.logger.log(
        `Evaluation saved to database for message ${result.messageId}`
      );
    } catch (error) {
      this.logger.error("Failed to save evaluation to database:", error);
      // Don't throw - evaluation was successful, just logging failed
    }
  }

  /**
   * Build user context string for evaluation
   */
  private buildUserContext(profile: any): string {
    if (!profile) {
      return "User profile: Not available";
    }

    const parts: string[] = ["User profile:"];

    if (profile.monthlyIncome) {
      parts.push(
        `- Monthly income: Rp${profile.monthlyIncome.toLocaleString()}`
      );
    }
    if (profile.monthlyExpenses) {
      parts.push(
        `- Monthly expenses: Rp${profile.monthlyExpenses.toLocaleString()}`
      );
    }
    if (profile.currentSavings) {
      parts.push(
        `- Current savings: Rp${profile.currentSavings.toLocaleString()}`
      );
    }
    if (profile.riskTolerance) {
      parts.push(`- Risk tolerance: ${profile.riskTolerance}`);
    }
    if (profile.financialGoals && profile.financialGoals.length > 0) {
      parts.push(`- Financial goals: ${profile.financialGoals.join(", ")}`);
    }
    if (profile.occupation) {
      parts.push(`- Occupation: ${profile.occupation}`);
    }
    if (profile.dependents) {
      parts.push(`- Dependents: ${profile.dependents}`);
    }

    return parts.join("\n");
  }

  /**
   * Call Gemini as LLM-as-a-Judge evaluator
   */
  private async callLLMJudge(
    userQuestion: string,
    aiResponse: string,
    userContext: string,
    conversationHistory: any[]
  ): Promise<{ criteria: QualityEvaluationCriteria; feedback: string }> {
    const conversationContext = conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n\n");

    const evaluationPrompt = `You are an expert evaluator for AI financial advisors. Your task is to evaluate the quality of an AI assistant's response to a user's financial question.

**User Context:**
${userContext}

**Conversation History:**
${conversationContext}

**User Question:**
${userQuestion}

**AI Response to Evaluate:**
${aiResponse}

---

**Evaluation Task:**

Evaluate the AI response across the following 6 criteria. Provide a score from 0-100 for each criterion, where:
- 0-20: Very Poor
- 21-40: Poor
- 41-60: Fair
- 61-80: Good
- 81-100: Excellent

**Criteria:**

1. **Accuracy (0-100)**: Is the financial information correct and factually sound? Are there any errors or misleading statements?

2. **Relevance (0-100)**: Does the response directly address the user's question? Is it focused on what the user asked?

3. **Actionability (0-100)**: Does the response provide concrete, actionable steps the user can take? Are recommendations practical?

4. **Clarity (0-100)**: Is the language clear, simple, and easy to understand? Is it appropriate for the Indonesian context (using Bahasa Indonesia friendly terms)?

5. **Completeness (0-100)**: Does the response cover all important aspects of the question? Are there any critical gaps?

6. **Personalization (0-100)**: Is the advice tailored to the user's specific context (income, goals, risk tolerance, etc.)? Or is it generic?

**Output Format (STRICT JSON):**

Respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):

{
  "accuracy": <score 0-100>,
  "relevance": <score 0-100>,
  "actionability": <score 0-100>,
  "clarity": <score 0-100>,
  "completeness": <score 0-100>,
  "personalization": <score 0-100>,
  "feedback": "<2-3 sentences explaining the overall quality and any major strengths or weaknesses>"
}

**IMPORTANT:** 
- Be objective and fair
- Consider the Indonesian financial context
- Scores should reflect realistic quality, not just politeness
- Feedback should be constructive and specific
- Output MUST be valid JSON only, no other text`;

    try {
      this.logger.debug("Calling Gemini for LLM-as-a-Judge evaluation...");

      if (!this.gemini.isGeminiAvailable()) {
        this.logger.warn("Gemini not available, using fallback scoring");
        return this.getFallbackEvaluation();
      }

      // Call Gemini with evaluation prompt (maxRetries = 2)
      const result = await this.gemini["callGeminiWithRetry"](
        evaluationPrompt,
        2
      );

      // Extract response text
      const response = await result.response;
      const responseText = response.text();

      // Parse JSON response
      let evaluationData;
      try {
        // Try to extract JSON from response (in case it's wrapped in markdown)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          evaluationData = JSON.parse(jsonMatch[0]);
        } else {
          evaluationData = JSON.parse(responseText);
        }
      } catch (parseError) {
        this.logger.error("Failed to parse evaluation JSON:", parseError);
        this.logger.debug("Raw response:", responseText);
        return this.getFallbackEvaluation();
      }

      // Validate scores are within range
      const criteria: QualityEvaluationCriteria = {
        accuracy: this.clampScore(evaluationData.accuracy),
        relevance: this.clampScore(evaluationData.relevance),
        actionability: this.clampScore(evaluationData.actionability),
        clarity: this.clampScore(evaluationData.clarity),
        completeness: this.clampScore(evaluationData.completeness),
        personalization: this.clampScore(evaluationData.personalization),
      };

      return {
        criteria,
        feedback: evaluationData.feedback || "No feedback provided",
      };
    } catch (error) {
      this.logger.error("Error calling LLM-as-a-Judge:", error);
      return this.getFallbackEvaluation();
    }
  }

  /**
   * Fallback evaluation when Gemini is unavailable
   */
  private getFallbackEvaluation(): {
    criteria: QualityEvaluationCriteria;
    feedback: string;
  } {
    return {
      criteria: {
        accuracy: 75,
        relevance: 75,
        actionability: 70,
        clarity: 80,
        completeness: 70,
        personalization: 65,
      },
      feedback: "Automated evaluation unavailable. Using default scoring.",
    };
  }

  /**
   * Clamp score to 0-100 range
   */
  private clampScore(score: number): number {
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate overall score (average of all criteria)
   */
  private calculateOverallScore(criteria: QualityEvaluationCriteria): number {
    const scores = [
      criteria.accuracy,
      criteria.relevance,
      criteria.actionability,
      criteria.clarity,
      criteria.completeness,
      criteria.personalization,
    ];

    const sum = scores.reduce((acc, score) => acc + score, 0);
    return Math.round((sum / scores.length) * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get evaluation by ID
   *
   * @param evaluationId - Evaluation ID
   * @returns Evaluation record
   */
  async getEvaluationById(evaluationId: string) {
    this.logger.log(`Fetching evaluation: ${evaluationId}`);

    const evaluation = await this.prisma.qualityEvaluation.findUnique({
      where: { id: evaluationId },
    });

    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${evaluationId} not found`);
    }

    return evaluation;
  }

  /**
   * Get evaluations with filters and pagination
   *
   * @param query - Filter and pagination parameters
   * @returns Paginated list of evaluations
   */
  async getEvaluations(query: GetEvaluationsQueryDto) {
    this.logger.log(
      `Fetching evaluations with filters: ${JSON.stringify(query)}`
    );

    const { userId, minScore, maxScore, status, page = 1, limit = 20 } = query;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (minScore !== undefined || maxScore !== undefined) {
      where.overallScore = {};
      if (minScore !== undefined) {
        where.overallScore.gte = minScore;
      }
      if (maxScore !== undefined) {
        where.overallScore.lte = maxScore;
      }
    }

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [evaluations, total] = await Promise.all([
      this.prisma.qualityEvaluation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.qualityEvaluation.count({ where }),
    ]);

    return {
      data: evaluations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get evaluation statistics
   *
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Aggregated statistics
   */
  async getStatistics(
    startDate?: Date,
    endDate?: Date
  ): Promise<EvaluationStatisticsDto> {
    this.logger.log(`Fetching statistics from ${startDate} to ${endDate}`);

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const evaluations = await this.prisma.qualityEvaluation.findMany({
      where,
      select: {
        overallScore: true,
        accuracy: true,
        relevance: true,
        actionability: true,
        clarity: true,
        completeness: true,
        personalization: true,
        createdAt: true,
      },
    });

    if (evaluations.length === 0) {
      return {
        totalEvaluations: 0,
        averageScore: 0,
        averageScoresByCriteria: {
          accuracy: 0,
          relevance: 0,
          actionability: 0,
          clarity: 0,
          completeness: 0,
          personalization: 0,
        },
        dateRange: {
          startDate: startDate || new Date(),
          endDate: endDate || new Date(),
        },
      };
    }

    const totalEvaluations = evaluations.length;

    const sum = evaluations.reduce(
      (acc, evaluation) => ({
        overall: acc.overall + evaluation.overallScore,
        accuracy: acc.accuracy + evaluation.accuracy,
        relevance: acc.relevance + evaluation.relevance,
        actionability: acc.actionability + evaluation.actionability,
        clarity: acc.clarity + evaluation.clarity,
        completeness: acc.completeness + evaluation.completeness,
        personalization: acc.personalization + evaluation.personalization,
      }),
      {
        overall: 0,
        accuracy: 0,
        relevance: 0,
        actionability: 0,
        clarity: 0,
        completeness: 0,
        personalization: 0,
      }
    );

    return {
      totalEvaluations,
      averageScore: Math.round((sum.overall / totalEvaluations) * 100) / 100,
      averageScoresByCriteria: {
        accuracy: Math.round((sum.accuracy / totalEvaluations) * 100) / 100,
        relevance: Math.round((sum.relevance / totalEvaluations) * 100) / 100,
        actionability:
          Math.round((sum.actionability / totalEvaluations) * 100) / 100,
        clarity: Math.round((sum.clarity / totalEvaluations) * 100) / 100,
        completeness:
          Math.round((sum.completeness / totalEvaluations) * 100) / 100,
        personalization:
          Math.round((sum.personalization / totalEvaluations) * 100) / 100,
      },
      dateRange: {
        startDate: startDate || evaluations[evaluations.length - 1].createdAt,
        endDate: endDate || evaluations[0].createdAt,
      },
    };
  }

  /**
   * Get evaluations for a specific user
   *
   * @param userId - User ID
   * @returns List of evaluations for the user
   */
  async getUserEvaluations(userId: string) {
    this.logger.log(`Fetching evaluations for user: ${userId}`);

    const evaluations = await this.prisma.qualityEvaluation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50, // Last 50 evaluations
    });

    return evaluations;
  }

  /**
   * Delete an evaluation
   *
   * @param evaluationId - Evaluation ID
   */
  async deleteEvaluation(evaluationId: string) {
    this.logger.log(`Deleting evaluation: ${evaluationId}`);

    const evaluation = await this.prisma.qualityEvaluation.findUnique({
      where: { id: evaluationId },
    });

    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${evaluationId} not found`);
    }

    await this.prisma.qualityEvaluation.delete({
      where: { id: evaluationId },
    });

    this.logger.log(`Evaluation ${evaluationId} deleted successfully`);
  }
}
