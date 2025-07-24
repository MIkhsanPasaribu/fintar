import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Delete,
  HttpStatus,
  HttpException,
  Logger,
} from "@nestjs/common";
import { AiService } from "./ai.service";
import {
  FinancialAnalysisRequest,
  FinancialAdviceRequest,
} from "./agents/financial-ai-agent.service";
import { ChatRequest } from "./agents/chat-agent.service";
import { ConsultationRequest } from "./agents/consultant-agent.service";

@Controller("ai")
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private aiService: AiService) {}

  /**
   * Financial AI Endpoints
   */

  @Post("financial/analyze")
  async analyzeFinancialData(@Body() request: FinancialAnalysisRequest) {
    try {
      return await this.aiService.analyzeFinancialData(request);
    } catch (error) {
      this.logger.error(
        `Financial analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Financial analysis failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("financial/advice")
  async getFinancialAdvice(@Body() request: FinancialAdviceRequest) {
    try {
      return await this.aiService.getFinancialAdvice(request);
    } catch (error) {
      this.logger.error(
        `Financial advice failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Financial advice failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("financial/portfolio")
  async analyzePortfolio(
    @Body()
    body: {
      userId: string;
      sessionId: string;
      portfolioData: Record<string, any>;
    }
  ) {
    try {
      return await this.aiService.analyzePortfolio(
        body.userId,
        body.sessionId,
        body.portfolioData
      );
    } catch (error) {
      this.logger.error(
        `Portfolio analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Portfolio analysis failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("financial/risk")
  async assessRisk(
    @Body()
    body: {
      userId: string;
      sessionId: string;
      investmentData: Record<string, any>;
    }
  ) {
    try {
      return await this.aiService.assessInvestmentRisk(
        body.userId,
        body.sessionId,
        body.investmentData
      );
    } catch (error) {
      this.logger.error(
        `Risk assessment failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Risk assessment failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("financial/budget")
  async generateBudgetRecommendations(
    @Body()
    body: {
      userId: string;
      sessionId: string;
      budgetData: Record<string, any>;
    }
  ) {
    try {
      return await this.aiService.generateBudgetRecommendations(
        body.userId,
        body.sessionId,
        body.budgetData
      );
    } catch (error) {
      this.logger.error(
        `Budget recommendations failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Budget recommendations failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Chat Endpoints
   */

  @Post("chat")
  async processChat(@Body() request: ChatRequest) {
    try {
      return await this.aiService.processChat(request);
    } catch (error) {
      this.logger.error(
        `Chat processing failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Chat processing failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("chat/session/:sessionId")
  async getChatSession(@Param("sessionId") sessionId: string) {
    try {
      const session = await this.aiService.getChatSession(sessionId);
      if (!session) {
        throw new HttpException("Session not found", HttpStatus.NOT_FOUND);
      }
      return session;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        `Get chat session failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get chat session",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("chat/history/:sessionId")
  async getChatHistory(
    @Param("sessionId") sessionId: string,
    @Query("limit") limit?: string
  ) {
    try {
      const limitNum = limit ? parseInt(limit) : undefined;
      return await this.aiService.getChatHistory(sessionId, limitNum);
    } catch (error) {
      this.logger.error(
        `Get chat history failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get chat history",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("chat/summary/:sessionId")
  async getChatSummary(@Param("sessionId") sessionId: string) {
    try {
      const summary = await this.aiService.getChatSummary(sessionId);
      if (!summary) {
        throw new HttpException("Session not found", HttpStatus.NOT_FOUND);
      }
      return summary;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        `Get chat summary failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get chat summary",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete("chat/session/:sessionId")
  async clearChatSession(@Param("sessionId") sessionId: string) {
    try {
      const cleared = await this.aiService.clearChatSession(sessionId);
      return { success: cleared };
    } catch (error) {
      this.logger.error(
        `Clear chat session failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to clear chat session",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("chat/sessions/user/:userId")
  async getUserChatSessions(@Param("userId") userId: string) {
    try {
      return await this.aiService.getUserChatSessions(userId);
    } catch (error) {
      this.logger.error(
        `Get user chat sessions failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get user chat sessions",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Consultation Endpoints
   */

  @Post("consultation")
  async getBusinessConsultation(@Body() request: ConsultationRequest) {
    try {
      return await this.aiService.getBusinessConsultation(request);
    } catch (error) {
      this.logger.error(
        `Business consultation failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Business consultation failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("consultation/industry-insights/:industryType")
  async getIndustryInsights(
    @Param("industryType") industryType: string,
    @Query("userId") userId: string,
    @Query("sessionId") sessionId: string
  ) {
    try {
      if (!userId || !sessionId) {
        throw new HttpException(
          "userId and sessionId are required",
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.aiService.getIndustryInsights(
        userId,
        sessionId,
        industryType
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        `Get industry insights failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get industry insights",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("consultation/strategic-advice")
  async getStrategicAdvice(
    @Body()
    body: {
      userId: string;
      sessionId: string;
      industryType: string;
      challenge: string;
      businessContext: Record<string, any>;
    }
  ) {
    try {
      return await this.aiService.getStrategicAdvice(
        body.userId,
        body.sessionId,
        body.industryType,
        body.challenge,
        body.businessContext
      );
    } catch (error) {
      this.logger.error(
        `Strategic advice failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Strategic advice failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("consultation/operational-analysis")
  async analyzeOperationalEfficiency(
    @Body()
    body: {
      userId: string;
      sessionId: string;
      industryType: string;
      operationalData: Record<string, any>;
    }
  ) {
    try {
      return await this.aiService.analyzeOperationalEfficiency(
        body.userId,
        body.sessionId,
        body.industryType,
        body.operationalData
      );
    } catch (error) {
      this.logger.error(
        `Operational analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Operational analysis failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("consultation/market-analysis")
  async generateMarketAnalysis(
    @Body()
    body: {
      userId: string;
      sessionId: string;
      industryType: string;
      marketScope: "local" | "national" | "global";
      specificMarkets?: string[];
    }
  ) {
    try {
      return await this.aiService.generateMarketAnalysis(
        body.userId,
        body.sessionId,
        body.industryType,
        body.marketScope,
        body.specificMarkets
      );
    } catch (error) {
      this.logger.error(
        `Market analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Market analysis failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * System Endpoints
   */

  @Get("health")
  async getHealthStatus() {
    try {
      return await this.aiService.getHealthStatus();
    } catch (error) {
      this.logger.error(
        `Health check failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Health check failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("capabilities")
  getCapabilities() {
    try {
      return this.aiService.getCapabilities();
    } catch (error) {
      this.logger.error(
        `Get capabilities failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get capabilities",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("configuration")
  getConfiguration() {
    try {
      return this.aiService.getConfiguration();
    } catch (error) {
      this.logger.error(
        `Get configuration failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get configuration",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("metrics")
  async getMetrics(
    @Query("timeRange") timeRange: "hour" | "day" | "week" | "month" = "day"
  ) {
    try {
      return await this.aiService.getPerformanceMetrics(timeRange);
    } catch (error) {
      this.logger.error(
        `Get metrics failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get metrics",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("traces/:sessionId")
  async getSessionTraces(@Param("sessionId") sessionId: string) {
    try {
      return await this.aiService.getSessionTraces(sessionId);
    } catch (error) {
      this.logger.error(
        `Get session traces failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to get session traces",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Utility Endpoints
   */

  @Post("session/generate")
  generateSessionId() {
    try {
      return { sessionId: this.aiService.generateSessionId() };
    } catch (error) {
      this.logger.error(
        `Generate session ID failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Failed to generate session ID",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("workflow/execute")
  async executeCustomWorkflow(
    @Body()
    body: {
      workflowType: "financial_analysis" | "consultation";
      userId: string;
      sessionId: string;
      input: Record<string, any>;
      initialContext?: Record<string, any>;
    }
  ) {
    try {
      return await this.aiService.executeCustomWorkflow(
        body.workflowType,
        body.userId,
        body.sessionId,
        body.input,
        body.initialContext
      );
    } catch (error) {
      this.logger.error(
        `Workflow execution failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Workflow execution failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("batch")
  async batchProcess(
    @Body()
    body: {
      requests: Array<{
        type: "chat" | "financial_analysis" | "consultation";
        data: any;
      }>;
    }
  ) {
    try {
      return await this.aiService.batchProcess(body.requests);
    } catch (error) {
      this.logger.error(
        `Batch processing failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Batch processing failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("maintenance")
  async performMaintenance() {
    try {
      return await this.aiService.performMaintenance();
    } catch (error) {
      this.logger.error(
        `Maintenance failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new HttpException(
        "Maintenance failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
