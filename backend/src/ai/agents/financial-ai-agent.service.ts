import { Injectable, Logger } from "@nestjs/common";
import { LangChainService, ChatMessage } from "../services/langchain.service";
import { LangSmithService } from "../services/langsmith.service";
import {
  LangGraphSimpleService,
  SimpleWorkflowConfig,
} from "../services/langgraph-simple.service";

export interface FinancialAnalysisRequest {
  userId: string;
  sessionId: string;
  analysisType: "portfolio" | "budget" | "forecast" | "risk" | "comprehensive";
  data: Record<string, any>;
  preferences?: {
    riskTolerance: "conservative" | "moderate" | "aggressive";
    investmentHorizon: "short" | "medium" | "long";
    goals: string[];
  };
}

export interface FinancialAdviceRequest {
  userId: string;
  sessionId: string;
  question: string;
  context?: Record<string, any>;
  previousMessages?: ChatMessage[];
}

export interface FinancialAnalysisResult {
  analysisId: string;
  analysis: string;
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  generatedAt: Date;
  metadata: Record<string, any>;
}

export interface FinancialAdviceResult {
  responseId: string;
  advice: string;
  confidence: number;
  sources: string[];
  followUpQuestions: string[];
  generatedAt: Date;
}

@Injectable()
export class FinancialAiAgentService {
  private readonly logger = new Logger(FinancialAiAgentService.name);

  constructor(
    private langChainService: LangChainService,
    private langSmithService: LangSmithService,
    private langGraphService: LangGraphSimpleService
  ) {}

  /**
   * Perform comprehensive financial analysis using workflow
   */
  async performFinancialAnalysis(
    request: FinancialAnalysisRequest
  ): Promise<FinancialAnalysisResult> {
    const analysisId = `fa_${request.sessionId}_${Date.now()}`;

    try {
      this.logger.log(`Starting financial analysis: ${analysisId}`);

      // Prepare workflow configuration
      const workflowConfig: SimpleWorkflowConfig = {
        userId: request.userId,
        sessionId: request.sessionId,
        workflowType: "financial_analysis",
        initialContext: {
          analysisType: request.analysisType,
          data: request.data,
          preferences: request.preferences,
          analysisId,
        },
      };

      // Execute financial analysis workflow
      const workflowResult =
        await this.langGraphService.executeFinancialAnalysisWorkflow(
          workflowConfig,
          request.data
        );

      if (!workflowResult.success) {
        throw new Error(`Workflow failed: ${workflowResult.error}`);
      }

      // Extract results from workflow
      const finalState = workflowResult.finalState;
      const context = finalState.context;

      // Generate recommendations based on analysis
      const recommendations = this.extractRecommendations(context);
      const riskLevel = this.assessRiskLevel(
        context,
        request.preferences?.riskTolerance
      );
      const confidence = this.calculateConfidence(context);

      const result: FinancialAnalysisResult = {
        analysisId,
        analysis:
          context.portfolioAnalysis ||
          context.riskAssessment ||
          "Analysis completed",
        recommendations,
        riskLevel,
        confidence,
        generatedAt: new Date(),
        metadata: {
          analysisType: request.analysisType,
          steps: workflowResult.steps,
          duration: workflowResult.duration,
          workflowSuccess: workflowResult.success,
        },
      };

      this.logger.log(`Financial analysis completed: ${analysisId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Financial analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );

      // Return a fallback result
      return {
        analysisId,
        analysis: "Analysis could not be completed due to an error.",
        recommendations: ["Please try again later or contact support."],
        riskLevel: "medium",
        confidence: 0,
        generatedAt: new Date(),
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          analysisType: request.analysisType,
        },
      };
    }
  }

  /**
   * Provide financial advice through conversational interface
   */
  async provideFinancialAdvice(
    request: FinancialAdviceRequest
  ): Promise<FinancialAdviceResult> {
    const responseId = `fa_${request.sessionId}_${Date.now()}`;

    try {
      this.logger.log(`Providing financial advice: ${responseId}`);

      // Start tracing
      const traceId = await this.langSmithService.startTrace(
        request.sessionId,
        request.userId,
        "financial_advice",
        { question: request.question, context: request.context }
      );

      // Prepare conversation context
      let messages: ChatMessage[] = [];

      if (request.previousMessages) {
        messages = [...request.previousMessages];
      }

      // Add current question
      messages.push({
        role: "user",
        content: request.question,
        timestamp: new Date(),
      });

      // Get AI response
      const advice = await this.langChainService.financialAdvisorChat(
        request.question,
        request.context
      );

      // Generate follow-up questions
      const followUpQuestions = await this.generateFollowUpQuestions(
        request.question,
        advice,
        request.context
      );

      // Calculate confidence based on question complexity and context
      const confidence = this.calculateAdviceConfidence(
        request.question,
        request.context
      );

      // End tracing
      await this.langSmithService.endTrace(traceId, advice, true);

      const result: FinancialAdviceResult = {
        responseId,
        advice,
        confidence,
        sources: ["Fintar AI Financial Advisor"],
        followUpQuestions,
        generatedAt: new Date(),
      };

      this.logger.log(`Financial advice provided: ${responseId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Financial advice failed: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        responseId,
        advice:
          "I apologize, but I encountered an issue providing advice. Please try rephrasing your question or contact support.",
        confidence: 0,
        sources: [],
        followUpQuestions: [],
        generatedAt: new Date(),
      };
    }
  }

  /**
   * Analyze portfolio performance
   */
  async analyzePortfolio(
    userId: string,
    sessionId: string,
    portfolioData: Record<string, any>
  ): Promise<string> {
    try {
      const analysis = await this.langChainService.analyzeFinancialData(
        portfolioData,
        "portfolio"
      );

      return analysis;
    } catch (error) {
      this.logger.error(
        `Portfolio analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Assess investment risk
   */
  async assessRisk(
    userId: string,
    sessionId: string,
    investmentData: Record<string, any>
  ): Promise<string> {
    try {
      const riskAnalysis = await this.langChainService.analyzeFinancialData(
        investmentData,
        "risk"
      );

      return riskAnalysis;
    } catch (error) {
      this.logger.error(
        `Risk assessment failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Generate budget recommendations
   */
  async generateBudgetRecommendations(
    userId: string,
    sessionId: string,
    budgetData: Record<string, any>
  ): Promise<string> {
    try {
      const budgetAnalysis = await this.langChainService.analyzeFinancialData(
        budgetData,
        "budget"
      );

      return budgetAnalysis;
    } catch (error) {
      this.logger.error(
        `Budget analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  // Private helper methods

  private extractRecommendations(context: Record<string, any>): string[] {
    const recommendations: string[] = [];

    if (context.recommendations) {
      // Parse recommendations from text
      const recText = context.recommendations as string;
      const lines = recText
        .split("\n")
        .filter(
          (line) =>
            line.trim().length > 0 &&
            (line.includes("•") ||
              line.includes("-") ||
              line.includes("1.") ||
              line.includes("2."))
        );
      recommendations.push(...lines.map((line) => line.trim()));
    }

    // Add default recommendations if none found
    if (recommendations.length === 0) {
      recommendations.push(
        "Review your portfolio allocation regularly",
        "Consider diversifying across different asset classes",
        "Monitor market conditions and adjust strategy accordingly"
      );
    }

    return recommendations.slice(0, 5); // Limit to top 5
  }

  private assessRiskLevel(
    context: Record<string, any>,
    riskTolerance?: "conservative" | "moderate" | "aggressive"
  ): "low" | "medium" | "high" {
    // Consider multiple factors
    let riskScore = 0;

    if (context.riskLevel === "high") riskScore += 3;
    else if (context.riskLevel === "medium") riskScore += 2;
    else riskScore += 1;

    if (riskTolerance === "aggressive") riskScore += 1;
    else if (riskTolerance === "conservative") riskScore -= 1;

    if (riskScore <= 2) return "low";
    if (riskScore <= 4) return "medium";
    return "high";
  }

  private calculateConfidence(context: Record<string, any>): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence based on available data
    if (context.dataCollected) confidence += 0.1;
    if (context.riskAssessment) confidence += 0.1;
    if (context.portfolioAnalysis) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  private calculateAdviceConfidence(
    question: string,
    context?: Record<string, any>
  ): number {
    let confidence = 0.8; // Base confidence for advice

    // Reduce confidence for very complex questions
    if (question.length > 200) confidence -= 0.1;

    // Increase confidence if we have context
    if (context && Object.keys(context).length > 0) confidence += 0.1;

    // Reduce confidence for uncertain phrases
    const uncertainPhrases = [
      "maybe",
      "possibly",
      "might",
      "unsure",
      "not sure",
    ];
    if (
      uncertainPhrases.some((phrase) => question.toLowerCase().includes(phrase))
    ) {
      confidence -= 0.2;
    }

    return Math.max(0.1, Math.min(confidence, 1.0));
  }

  private async generateFollowUpQuestions(
    originalQuestion: string,
    advice: string,
    context?: Record<string, any>
  ): Promise<string[]> {
    const followUpQuestions: string[] = [];

    // Generate contextual follow-up questions
    if (originalQuestion.toLowerCase().includes("investment")) {
      followUpQuestions.push(
        "What is your risk tolerance for investments?",
        "How long do you plan to hold these investments?",
        "Are you interested in specific sectors or asset types?"
      );
    } else if (originalQuestion.toLowerCase().includes("budget")) {
      followUpQuestions.push(
        "Would you like help setting up savings goals?",
        "Do you need advice on reducing specific expenses?",
        "Are you interested in investment options for surplus income?"
      );
    } else if (originalQuestion.toLowerCase().includes("retirement")) {
      followUpQuestions.push(
        "When do you plan to retire?",
        "Have you calculated your retirement income needs?",
        "Are you maximizing your retirement account contributions?"
      );
    } else {
      // Generic follow-up questions
      followUpQuestions.push(
        "Would you like me to analyze your current financial situation?",
        "Do you have any specific financial goals you'd like to discuss?",
        "Are you interested in learning about investment opportunities?"
      );
    }

    return followUpQuestions.slice(0, 3); // Limit to 3 questions
  }
}
