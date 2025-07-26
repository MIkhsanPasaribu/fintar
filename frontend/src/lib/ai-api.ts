/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./api";

// AI Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string[];
  messageType?: "text" | "financial_analysis" | "advice" | "error";
}

export interface ChatRequest {
  userId: string;
  sessionId: string;
  message: string;
  context?: {
    conversationHistory?: ChatMessage[];
    userProfile?: any;
    previousAnalysis?: any;
  };
}

export interface ChatResponse {
  response: string;
  messageType: "text" | "financial_analysis" | "advice" | "error";
  suggestions?: string[];
  analysisData?: any;
  sessionId: string;
  timestamp: string;
}

// Financial Analysis Types
export interface FinancialAnalysisRequest {
  userId: string;
  sessionId: string;
  financialData: {
    income: number;
    expenses: Record<string, number>;
    savings: number;
    debts?: Record<string, number>;
    investments?: Record<string, number>;
  };
  analysisType:
    | "budget"
    | "cash_flow"
    | "debt_analysis"
    | "investment_portfolio";
}

export interface FinancialAdviceRequest {
  userId: string;
  sessionId: string;
  question: string;
  userProfile: {
    age: number;
    income: number;
    riskTolerance: "low" | "medium" | "high";
    financialGoals: string[];
    currentSavings?: number;
    monthlyExpenses?: number;
  };
}

export interface BudgetRecommendationRequest {
  userId: string;
  sessionId: string;
  budgetData: {
    income: number;
    currentExpenses: Record<string, number>;
    savingsGoal?: number;
    debtPayments?: Record<string, number>;
  };
}

export interface PortfolioAnalysisRequest {
  userId: string;
  sessionId: string;
  portfolioData: {
    investments: Record<
      string,
      { amount: number; type: string; riskLevel: string }
    >;
    totalValue: number;
    expectedReturn?: number;
    timeHorizon?: number;
  };
}

export interface RiskAssessmentRequest {
  userId: string;
  sessionId: string;
  investmentData: {
    investmentType: string;
    amount: number;
    timeHorizon: number;
    riskTolerance: "low" | "medium" | "high";
    currentPortfolio?: any;
  };
}

/**
 * AI Service Class for Frontend-Backend Integration
 */
export class AIService {
  /**
   * Send chat message to AI
   */
  static async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>("/ai/chat", request);
      return (
        response.data || {
          response: "Maaf, terjadi error dalam sistem AI. Silakan coba lagi.",
          messageType: "error",
          sessionId: request.sessionId,
          timestamp: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("Chat API Error:", error);
      // Fallback response
      return {
        response:
          "Maaf, saya tidak dapat terhubung dengan server saat ini. Silakan coba lagi nanti.",
        messageType: "error",
        sessionId: request.sessionId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get financial analysis
   */
  static async analyzeFinancialData(
    request: FinancialAnalysisRequest
  ): Promise<any> {
    try {
      const response = await apiClient.post("/ai/financial/analyze", request);
      return response.data;
    } catch (error) {
      console.error("Financial Analysis API Error:", error);
      throw new Error("Gagal menganalisis data keuangan. Silakan coba lagi.");
    }
  }

  /**
   * Get financial advice
   */
  static async getFinancialAdvice(
    request: FinancialAdviceRequest
  ): Promise<any> {
    try {
      const response = await apiClient.post("/ai/financial/advice", request);
      return response.data;
    } catch (error) {
      console.error("Financial Advice API Error:", error);
      throw new Error("Gagal mendapatkan saran keuangan. Silakan coba lagi.");
    }
  }

  /**
   * Generate budget recommendations
   */
  static async getBudgetRecommendations(
    request: BudgetRecommendationRequest
  ): Promise<any> {
    try {
      const response = await apiClient.post("/ai/financial/budget", request);
      return response.data;
    } catch (error) {
      console.error("Budget Recommendations API Error:", error);
      throw new Error("Gagal membuat rekomendasi budget. Silakan coba lagi.");
    }
  }

  /**
   * Analyze investment portfolio
   */
  static async analyzePortfolio(
    request: PortfolioAnalysisRequest
  ): Promise<any> {
    try {
      const response = await apiClient.post("/ai/financial/portfolio", request);
      return response.data;
    } catch (error) {
      console.error("Portfolio Analysis API Error:", error);
      throw new Error("Gagal menganalisis portfolio. Silakan coba lagi.");
    }
  }

  /**
   * Assess investment risk
   */
  static async assessInvestmentRisk(
    request: RiskAssessmentRequest
  ): Promise<any> {
    try {
      const response = await apiClient.post("/ai/financial/risk", request);
      return response.data;
    } catch (error) {
      console.error("Risk Assessment API Error:", error);
      throw new Error("Gagal menilai risiko investasi. Silakan coba lagi.");
    }
  }

  /**
   * Get AI chat session history
   */
  static async getChatHistory(
    userId: string,
    sessionId: string
  ): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get(
        `/ai/chat/history/${userId}/${sessionId}`
      );
      return (response.data as ChatMessage[]) || [];
    } catch (error) {
      console.error("Chat History API Error:", error);
      return [];
    }
  }

  /**
   * Delete chat session
   */
  static async deleteChatSession(
    userId: string,
    sessionId: string
  ): Promise<boolean> {
    try {
      await apiClient.delete(`/ai/chat/session/${userId}/${sessionId}`);
      return true;
    } catch (error) {
      console.error("Delete Chat Session API Error:", error);
      return false;
    }
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(userId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/ai/chat/sessions/${userId}`);
      return (response.data as any[]) || [];
    } catch (error) {
      console.error("Get User Sessions API Error:", error);
      return [];
    }
  }

  /**
   * Generate session ID
   */
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate user ID (temporary - should come from auth)
   */
  static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default AIService;
