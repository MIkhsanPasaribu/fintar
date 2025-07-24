import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LangChainService } from "./services/langchain.service";
import { LangSmithService } from "./services/langsmith.service";
import { LangGraphSimpleService } from "./services/langgraph-simple.service";
import {
  FinancialAiAgentService,
  FinancialAnalysisRequest,
  FinancialAdviceRequest,
} from "./agents/financial-ai-agent.service";
import { ChatAgentService, ChatRequest } from "./agents/chat-agent.service";
import {
  ConsultantAgentService,
  ConsultationRequest,
} from "./agents/consultant-agent.service";
import { v4 as uuidv4 } from "uuid";

export interface AiServiceHealth {
  status: "healthy" | "degraded" | "unhealthy";
  services: {
    langchain: boolean;
    langsmith: boolean;
    langgraph: boolean;
    financial: boolean;
    chat: boolean;
    consultant: boolean;
  };
  lastChecked: Date;
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  status: "active" | "archived" | "expired";
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatHistory {
  sessionId: string;
  messages: ChatMessage[];
  totalMessages: number;
  hasMore: boolean;
}

export interface ChatSummary {
  sessionId: string;
  summary: string;
  keyTopics: string[];
  messageCount: number;
  duration: string;
  lastActivity: Date;
}

export interface SystemCapabilities {
  features: string[];
  models: string[];
  languages: string[];
  maxTokens: number;
  supportedFormats: string[];
}

export interface SystemConfiguration {
  provider: string;
  model: string;
  version: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
}

export interface PerformanceMetrics {
  timeRange: string;
  totalRequests: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  topEndpoints: Array<{ endpoint: string; count: number }>;
  performanceData: Array<{
    timestamp: Date;
    responseTime: number;
    success: boolean;
  }>;
}

export interface SessionTrace {
  sessionId: string;
  traces: Array<{
    traceId: string;
    timestamp: Date;
    operation: string;
    duration: number;
    status: "success" | "error";
    metadata: Record<string, any>;
  }>;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly chatSessions = new Map<string, ChatSession>();
  private readonly chatMessages = new Map<string, ChatMessage[]>();
  private readonly performanceData: Array<{
    timestamp: Date;
    responseTime: number;
    success: boolean;
    endpoint: string;
  }> = [];

  constructor(
    private configService: ConfigService,
    private langChainService: LangChainService,
    private langSmithService: LangSmithService,
    private langGraphService: LangGraphSimpleService,
    private financialAiAgentService: FinancialAiAgentService,
    private chatAgentService: ChatAgentService,
    private consultantAgentService: ConsultantAgentService
  ) {
    this.logger.log("AI Service initialized successfully");
  }

  /**
   * Financial Analysis Methods
   */
  async analyzeFinancialData(request: FinancialAnalysisRequest) {
    const startTime = Date.now();
    try {
      const result =
        await this.financialAiAgentService.performFinancialAnalysis(request);
      this.recordPerformance("analyzeFinancialData", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("analyzeFinancialData", startTime, false);
      this.logger.error("Financial analysis failed:", error);
      throw error;
    }
  }

  async getFinancialAdvice(request: FinancialAdviceRequest) {
    const startTime = Date.now();
    try {
      // Convert advice request to analysis request format
      const analysisRequest: FinancialAnalysisRequest = {
        ...request,
        analysisType: "comprehensive",
        data: request.context || {},
      };
      const result =
        await this.financialAiAgentService.performFinancialAnalysis(
          analysisRequest
        );
      this.recordPerformance("getFinancialAdvice", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("getFinancialAdvice", startTime, false);
      this.logger.error("Financial advice failed:", error);
      throw error;
    }
  }

  async analyzePortfolio(
    userId: string,
    sessionId: string,
    portfolioData: Record<string, any>
  ) {
    const startTime = Date.now();
    try {
      const request: FinancialAnalysisRequest = {
        userId,
        sessionId,
        analysisType: "portfolio",
        data: portfolioData,
      };
      const result =
        await this.financialAiAgentService.performFinancialAnalysis(request);
      this.recordPerformance("analyzePortfolio", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("analyzePortfolio", startTime, false);
      this.logger.error("Portfolio analysis failed:", error);
      throw error;
    }
  }

  async assessInvestmentRisk(
    userId: string,
    sessionId: string,
    investmentData: Record<string, any>
  ) {
    const startTime = Date.now();
    try {
      const request: FinancialAnalysisRequest = {
        userId,
        sessionId,
        analysisType: "risk",
        data: investmentData,
      };
      const result =
        await this.financialAiAgentService.performFinancialAnalysis(request);
      this.recordPerformance("assessInvestmentRisk", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("assessInvestmentRisk", startTime, false);
      this.logger.error("Investment risk assessment failed:", error);
      throw error;
    }
  }

  async generateBudgetRecommendations(
    userId: string,
    sessionId: string,
    budgetData: Record<string, any>
  ) {
    const startTime = Date.now();
    try {
      const request: FinancialAnalysisRequest = {
        userId,
        sessionId,
        analysisType: "budget",
        data: budgetData,
      };
      const result =
        await this.financialAiAgentService.performFinancialAnalysis(request);
      this.recordPerformance("generateBudgetRecommendations", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("generateBudgetRecommendations", startTime, false);
      this.logger.error("Budget recommendations failed:", error);
      throw error;
    }
  }

  /**
   * Chat Management Methods
   */
  async processChat(request: ChatRequest) {
    const startTime = Date.now();
    try {
      const result = await this.chatAgentService.processMessage(request);

      // Store chat message
      if (request.sessionId) {
        this.storeChatMessage(request.sessionId, {
          id: uuidv4(),
          sessionId: request.sessionId,
          role: "user",
          content: request.message,
          timestamp: new Date(),
        });

        this.storeChatMessage(request.sessionId, {
          id: uuidv4(),
          sessionId: request.sessionId,
          role: "assistant",
          content: result.message || "Response generated",
          timestamp: new Date(),
        });
      }

      this.recordPerformance("processChat", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("processChat", startTime, false);
      this.logger.error("Chat processing failed:", error);
      throw error;
    }
  }

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    const session = this.chatSessions.get(sessionId);
    if (!session) {
      return null;
    }
    return session;
  }

  async getChatHistory(
    sessionId: string,
    limit?: number
  ): Promise<ChatHistory> {
    const messages = this.chatMessages.get(sessionId) || [];
    const limitedMessages = limit ? messages.slice(-limit) : messages;

    return {
      sessionId,
      messages: limitedMessages,
      totalMessages: messages.length,
      hasMore: limit ? messages.length > limit : false,
    };
  }

  async getChatSummary(sessionId: string): Promise<ChatSummary | null> {
    const session = this.chatSessions.get(sessionId);
    const messages = this.chatMessages.get(sessionId) || [];

    if (!session || messages.length === 0) {
      return null;
    }

    const keyTopics = this.extractKeyTopics(messages);
    const duration = this.calculateSessionDuration(session);

    return {
      sessionId,
      summary: `Chat session with ${messages.length} messages covering topics: ${keyTopics.join(", ")}`,
      keyTopics,
      messageCount: messages.length,
      duration,
      lastActivity: session.updatedAt,
    };
  }

  async clearChatSession(sessionId: string): Promise<boolean> {
    const deleted =
      this.chatSessions.delete(sessionId) &&
      this.chatMessages.delete(sessionId);
    return deleted;
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    const userSessions = Array.from(this.chatSessions.values())
      .filter((session) => session.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return userSessions;
  }

  /**
   * Consultation Methods
   */
  async getBusinessConsultation(request: ConsultationRequest) {
    const startTime = Date.now();
    try {
      const result =
        await this.consultantAgentService.provideConsultation(request);
      this.recordPerformance("getBusinessConsultation", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("getBusinessConsultation", startTime, false);
      this.logger.error("Business consultation failed:", error);
      throw error;
    }
  }

  async getIndustryInsights(
    userId: string,
    sessionId: string,
    industryType: string
  ) {
    const startTime = Date.now();
    try {
      const request: ConsultationRequest = {
        userId,
        sessionId,
        industryType,
        consultationType: "general",
        businessData: { industryType },
      };
      const result =
        await this.consultantAgentService.provideConsultation(request);
      this.recordPerformance("getIndustryInsights", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("getIndustryInsights", startTime, false);
      this.logger.error("Industry insights failed:", error);
      throw error;
    }
  }

  async getStrategicAdvice(
    userId: string,
    sessionId: string,
    industryType: string,
    challenge: string,
    businessContext: Record<string, any>
  ) {
    const startTime = Date.now();
    try {
      const request: ConsultationRequest = {
        userId,
        sessionId,
        industryType,
        consultationType: "strategy",
        businessData: { industryType, challenge, ...businessContext },
      };
      const result =
        await this.consultantAgentService.provideConsultation(request);
      this.recordPerformance("getStrategicAdvice", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("getStrategicAdvice", startTime, false);
      this.logger.error("Strategic advice failed:", error);
      throw error;
    }
  }

  async analyzeOperationalEfficiency(
    userId: string,
    sessionId: string,
    industryType: string,
    operationalData: Record<string, any>
  ) {
    const startTime = Date.now();
    try {
      const request: ConsultationRequest = {
        userId,
        sessionId,
        industryType,
        consultationType: "operations",
        businessData: { industryType, ...operationalData },
      };
      const result =
        await this.consultantAgentService.provideConsultation(request);
      this.recordPerformance("analyzeOperationalEfficiency", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("analyzeOperationalEfficiency", startTime, false);
      this.logger.error("Operational analysis failed:", error);
      throw error;
    }
  }

  async generateMarketAnalysis(
    userId: string,
    sessionId: string,
    industryType: string,
    marketScope: "local" | "national" | "global",
    specificMarkets?: string[]
  ) {
    const startTime = Date.now();
    try {
      const request: ConsultationRequest = {
        userId,
        sessionId,
        industryType,
        consultationType: "marketing",
        businessData: { industryType, marketScope, specificMarkets },
      };
      const result =
        await this.consultantAgentService.provideConsultation(request);
      this.recordPerformance("generateMarketAnalysis", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("generateMarketAnalysis", startTime, false);
      this.logger.error("Market analysis failed:", error);
      throw error;
    }
  }

  /**
   * System Methods
   */
  getCapabilities(): SystemCapabilities {
    return {
      features: [
        "financial_analysis",
        "portfolio_analysis",
        "risk_assessment",
        "budget_planning",
        "chat_interaction",
        "business_consultation",
        "industry_insights",
        "strategic_advice",
        "operational_analysis",
        "market_analysis",
      ],
      models: ["gemini-1.5-pro", "gemini-1.5-flash"],
      languages: ["en", "id"],
      maxTokens: 8192,
      supportedFormats: ["text", "json"],
    };
  }

  getConfiguration(): SystemConfiguration {
    const config = this.langChainService.getConfig();
    return {
      provider: "Google Gemini",
      model: config.gemini.model || "gemini-1.5-pro",
      version: "1.0.0",
      features: {
        streaming: true,
        multimodal: false,
        functionCalling: true,
        memorySupport: true,
      },
      limits: {
        maxTokens: 8192,
        maxContextLength: 1000000,
        requestsPerMinute: 60,
        tokensPerMinute: 100000,
      },
    };
  }

  async getPerformanceMetrics(
    timeRange: "hour" | "day" | "week" | "month" = "day"
  ): Promise<PerformanceMetrics> {
    const now = new Date();
    const startTime = new Date();

    switch (timeRange) {
      case "hour":
        startTime.setHours(now.getHours() - 1);
        break;
      case "day":
        startTime.setDate(now.getDate() - 1);
        break;
      case "week":
        startTime.setDate(now.getDate() - 7);
        break;
      case "month":
        startTime.setMonth(now.getMonth() - 1);
        break;
    }

    const filteredData = this.performanceData.filter(
      (record) => record.timestamp >= startTime
    );

    const totalRequests = filteredData.length;
    const successfulRequests = filteredData.filter((record) => record.success);
    const averageResponseTime =
      totalRequests > 0
        ? filteredData.reduce((sum, record) => sum + record.responseTime, 0) /
          totalRequests
        : 0;

    const endpointCounts = filteredData.reduce(
      (acc, record) => {
        acc[record.endpoint] = (acc[record.endpoint] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      timeRange,
      totalRequests,
      averageResponseTime,
      successRate:
        totalRequests > 0
          ? (successfulRequests.length / totalRequests) * 100
          : 0,
      errorRate:
        totalRequests > 0
          ? ((totalRequests - successfulRequests.length) / totalRequests) * 100
          : 0,
      topEndpoints,
      performanceData: filteredData.map((record) => ({
        timestamp: record.timestamp,
        responseTime: record.responseTime,
        success: record.success,
      })),
    };
  }

  async getSessionTraces(sessionId: string): Promise<SessionTrace> {
    // Mock implementation - in a real system, this would query a tracing database
    return {
      sessionId,
      traces: [
        {
          traceId: uuidv4(),
          timestamp: new Date(),
          operation: "chat_processing",
          duration: 150,
          status: "success",
          metadata: { model: "gemini-1.5-pro", tokens: 450 },
        },
      ],
    };
  }

  generateSessionId(): string {
    return uuidv4();
  }

  async executeCustomWorkflow(
    workflowType: "financial_analysis" | "consultation",
    userId: string,
    sessionId: string,
    input: Record<string, any>,
    initialContext?: Record<string, any>
  ) {
    const startTime = Date.now();
    try {
      let result;

      if (workflowType === "financial_analysis") {
        const request: FinancialAnalysisRequest = {
          userId,
          sessionId,
          analysisType: "comprehensive",
          data: { ...input, ...initialContext },
        };
        result =
          await this.financialAiAgentService.performFinancialAnalysis(request);
      } else if (workflowType === "consultation") {
        const request: ConsultationRequest = {
          userId,
          sessionId,
          industryType: "general",
          consultationType: "general",
          businessData: { ...input, ...initialContext },
        };
        result = await this.consultantAgentService.provideConsultation(request);
      } else {
        throw new Error(`Unsupported workflow type: ${workflowType}`);
      }

      this.recordPerformance("executeCustomWorkflow", startTime, true);
      return result;
    } catch (error) {
      this.recordPerformance("executeCustomWorkflow", startTime, false);
      this.logger.error("Custom workflow execution failed:", error);
      throw error;
    }
  }

  async batchProcess(
    requests: Array<{
      type: "chat" | "financial_analysis" | "consultation";
      data: any;
    }>
  ) {
    const startTime = Date.now();
    try {
      const results = await Promise.allSettled(
        requests.map(async (request) => {
          switch (request.type) {
            case "chat":
              return await this.processChat(request.data as ChatRequest);
            case "financial_analysis":
              return await this.analyzeFinancialData(
                request.data as FinancialAnalysisRequest
              );
            case "consultation":
              return await this.getBusinessConsultation(
                request.data as ConsultationRequest
              );
            default:
              throw new Error(`Unsupported request type: ${request.type}`);
          }
        })
      );

      const successfulResults = results.filter(
        (result) => result.status === "fulfilled"
      );
      this.recordPerformance(
        "batchProcess",
        startTime,
        successfulResults.length === results.length
      );

      return {
        totalRequests: requests.length,
        successfulRequests: successfulResults.length,
        failedRequests: results.length - successfulResults.length,
        results: results.map((result, index) => ({
          index,
          status: result.status,
          data: result.status === "fulfilled" ? result.value : null,
          error: result.status === "rejected" ? result.reason?.message : null,
        })),
      };
    } catch (error) {
      this.recordPerformance("batchProcess", startTime, false);
      this.logger.error("Batch processing failed:", error);
      throw error;
    }
  }

  async performMaintenance() {
    const startTime = Date.now();
    try {
      // Clear old performance data (keep last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const originalLength = this.performanceData.length;

      // Remove old entries
      this.performanceData.splice(0, this.performanceData.length);
      this.performanceData.push(
        ...this.performanceData.filter(
          (record) => record.timestamp >= twentyFourHoursAgo
        )
      );

      // Clear expired chat sessions
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      let clearedSessions = 0;

      for (const [sessionId, session] of this.chatSessions.entries()) {
        if (session.updatedAt < sevenDaysAgo) {
          this.chatSessions.delete(sessionId);
          this.chatMessages.delete(sessionId);
          clearedSessions++;
        }
      }

      this.recordPerformance("performMaintenance", startTime, true);

      return {
        performanceDataCleaned: originalLength - this.performanceData.length,
        expiredSessionsCleared: clearedSessions,
        maintenanceCompletedAt: new Date(),
      };
    } catch (error) {
      this.recordPerformance("performMaintenance", startTime, false);
      this.logger.error("Maintenance failed:", error);
      throw error;
    }
  }

  /**
   * Health Check Methods
   */
  async getHealthStatus(): Promise<AiServiceHealth> {
    try {
      const services = {
        langchain: await this.checkLangChainHealth(),
        langsmith: await this.checkLangSmithHealth(),
        langgraph: await this.checkLangGraphHealth(),
        financial: await this.checkFinancialAgentHealth(),
        chat: await this.checkChatAgentHealth(),
        consultant: await this.checkConsultantAgentHealth(),
      };

      const allHealthy = Object.values(services).every((service) => service);
      const someHealthy = Object.values(services).some((service) => service);

      let status: "healthy" | "degraded" | "unhealthy";
      if (allHealthy) {
        status = "healthy";
      } else if (someHealthy) {
        status = "degraded";
      } else {
        status = "unhealthy";
      }

      return {
        status,
        services,
        lastChecked: new Date(),
      };
    } catch (error) {
      this.logger.error("Health check failed:", error);
      return {
        status: "unhealthy",
        services: {
          langchain: false,
          langsmith: false,
          langgraph: false,
          financial: false,
          chat: false,
          consultant: false,
        },
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Private Utility Methods
   */
  private recordPerformance(
    endpoint: string,
    startTime: number,
    success: boolean
  ) {
    const responseTime = Date.now() - startTime;
    this.performanceData.push({
      timestamp: new Date(),
      responseTime,
      success,
      endpoint,
    });

    // Keep only last 1000 records to prevent memory issues
    if (this.performanceData.length > 1000) {
      this.performanceData.splice(0, this.performanceData.length - 1000);
    }
  }

  private storeChatMessage(sessionId: string, message: ChatMessage) {
    // Ensure session exists
    if (!this.chatSessions.has(sessionId)) {
      this.chatSessions.set(sessionId, {
        sessionId,
        userId: message.role === "user" ? "unknown" : "system",
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
        status: "active",
      });
    }

    // Store message
    if (!this.chatMessages.has(sessionId)) {
      this.chatMessages.set(sessionId, []);
    }
    this.chatMessages.get(sessionId)!.push(message);

    // Update session
    const session = this.chatSessions.get(sessionId)!;
    session.messageCount = this.chatMessages.get(sessionId)!.length;
    session.updatedAt = new Date();
  }

  private extractKeyTopics(messages: ChatMessage[]): string[] {
    // Simple keyword extraction - in a real system, this would use NLP
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "can",
      "cannot",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "me",
      "him",
      "her",
      "us",
      "them",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
      "this",
      "that",
      "these",
      "those",
    ]);

    const wordCounts = new Map<string, number>();

    messages.forEach((message) => {
      const words = message.content
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3 && !commonWords.has(word));

      words.forEach((word) => {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      });
    });

    return Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  private calculateSessionDuration(session: ChatSession): string {
    const durationMs =
      session.updatedAt.getTime() - session.createdAt.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Health check methods
  private async checkLangChainHealth(): Promise<boolean> {
    try {
      const config = this.langChainService.getConfig();
      return !!config.gemini.apiKey;
    } catch (error) {
      this.logger.warn("LangChain health check failed:", error);
      return false;
    }
  }

  private async checkLangSmithHealth(): Promise<boolean> {
    try {
      // Simple check - assume healthy if service is available
      return true;
    } catch (error) {
      this.logger.warn("LangSmith health check failed:", error);
      return false;
    }
  }

  private async checkLangGraphHealth(): Promise<boolean> {
    try {
      const config = this.langGraphService.getConfig();
      return !!config;
    } catch (error) {
      this.logger.warn("LangGraph health check failed:", error);
      return false;
    }
  }

  private async checkFinancialAgentHealth(): Promise<boolean> {
    try {
      return true; // Simple check - service is available
    } catch (error) {
      this.logger.warn("Financial agent health check failed:", error);
      return false;
    }
  }

  private async checkChatAgentHealth(): Promise<boolean> {
    try {
      return true; // Simple check - service is available
    } catch (error) {
      this.logger.warn("Chat agent health check failed:", error);
      return false;
    }
  }

  private async checkConsultantAgentHealth(): Promise<boolean> {
    try {
      return true; // Simple check - service is available
    } catch (error) {
      this.logger.warn("Consultant agent health check failed:", error);
      return false;
    }
  }
}
