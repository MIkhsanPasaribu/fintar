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
   * Generate a unique session ID
   */
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new chat session
   */
  static async createChatSession(userId: string): Promise<string> {
    try {
      console.log("Creating new chat session for user:", userId);

      const requestData = {
        title: "Fintar AI Chat Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: userId,
        },
      };

      console.log("Sending session creation request:", requestData);

      const response = await apiClient.post(
        "/api/v1/chat/sessions",
        requestData
      );

      console.log("Raw session creation response:", response);
      console.log("Response data:", response.data);

      // Backend returns the session object directly, not wrapped in 'data'
      const responseData = response.data || response;
      const sessionId = responseData?.id || responseData?.sessionId;

      if (!sessionId) {
        console.error("Session creation response missing ID:", {
          responseData: responseData,
          fullResponse: response,
        });
        throw new Error("No session ID returned from backend");
      }

      console.log("Chat session created successfully:", sessionId);
      return sessionId;
    } catch (error: any) {
      console.error("Error creating chat session:", error);

      // Log more details about the error
      if (error?.response) {
        console.error("Backend error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }

      // Don't create fallback session, let the error bubble up
      throw new Error(`Failed to create chat session: ${error.message}`);
    }
  }

  /**
   * Send chat message to AI
   */
  static async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Ensure we have a valid session
      let currentSessionId = request.sessionId;
      if (
        !currentSessionId ||
        currentSessionId === "new" ||
        currentSessionId === "" ||
        currentSessionId.startsWith("session_") // Fallback session IDs are invalid
      ) {
        console.log("Creating new session for user:", request.userId);
        currentSessionId = await this.createChatSession(request.userId);
      }

      console.log("Sending message to session:", currentSessionId);

      // Send the message to backend
      const response = await apiClient.post(
        `/api/v1/chat/sessions/${currentSessionId}/messages`,
        {
          content: request.message,
          context: request.context,
        }
      );

      // Backend response format: { userMessage: {...}, aiMessage: {...}, sessionInfo: {...} }
      const responseData = response.data || response;
      console.log("Message response received:", responseData);

      return {
        response:
          responseData?.aiMessage?.content ||
          responseData?.message ||
          "AI berhasil memproses pesan Anda",
        messageType: "text",
        sessionId: currentSessionId,
        timestamp:
          responseData?.aiMessage?.timestamp || new Date().toISOString(),
        suggestions: responseData?.suggestions || [
          "Berikan analisis keuangan saya",
          "Rekomendasi investasi",
          "Buat rencana budget",
          "Tips menabung",
        ],
      };
    } catch (error) {
      console.error("Chat API Error:", error);

      // Check for specific error types
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      const isQuotaError =
        errorMessage.includes("quota") ||
        errorMessage.includes("temporarily unavailable") ||
        errorMessage.includes("high demand");

      if (isQuotaError) {
        throw new Error(
          "AI service is temporarily unavailable due to high demand. Please try again in a few minutes."
        );
      } else {
        throw new Error(`Failed to process message: ${errorMessage}`);
      }
    }
  }

  /**
   * Get financial analysis from AI
   */
  static async analyzeFinancialData(
    request?: FinancialAnalysisRequest
  ): Promise<any> {
    try {
      const response = await apiClient.get("/financial/ai-insights");
      return {
        success: true,
        insights:
          response.data?.insights || "Analisis keuangan berhasil diproses",
        data: response.data,
        metadata: response.data?.aiMetadata || {},
      };
    } catch (error) {
      console.error("Financial Analysis API Error:", error);
      return {
        success: false,
        error: "Gagal menganalisis data keuangan. Silakan coba lagi.",
        insights: "Maaf, analisis tidak dapat diproses saat ini.",
      };
    }
  }

  /**
   * Get AI financial planning advice
   */
  static async getFinancialAdvice(
    request?: FinancialAdviceRequest
  ): Promise<any> {
    try {
      const response = await apiClient.post("/financial/ai-plan", {
        duration: request?.timeframe || "1_year",
        goals: request?.goals || ["saving", "investment"],
      });
      return {
        success: true,
        plan: response.data?.plan || "Rencana keuangan berhasil dibuat",
        data: response.data,
        metadata: response.data?.aiMetadata || {},
      };
    } catch (error) {
      console.error("Financial Advice API Error:", error);
      return {
        success: false,
        error: "Gagal mendapatkan saran keuangan. Silakan coba lagi.",
        plan: "Maaf, rencana keuangan tidak dapat dibuat saat ini.",
      };
    }
  }

  /**
   * Generate AI budget recommendations
   */
  static async getBudgetRecommendations(
    request?: BudgetRecommendationRequest
  ): Promise<any> {
    try {
      const response = await apiClient.get(
        "/financial/budget/ai-recommendations"
      );
      return {
        success: true,
        recommendations:
          response.data?.recommendations ||
          "Rekomendasi budget berhasil dibuat",
        data: response.data,
        metadata: response.data?.aiMetadata || {},
      };
    } catch (error) {
      console.error("Budget Recommendations API Error:", error);
      return {
        success: false,
        error: "Gagal membuat rekomendasi budget. Silakan coba lagi.",
        recommendations:
          "Maaf, rekomendasi budget tidak dapat dibuat saat ini.",
      };
    }
  }

  /**
   * Get AI investment recommendations
   */
  static async analyzePortfolio(
    request?: PortfolioAnalysisRequest
  ): Promise<any> {
    try {
      const response = await apiClient.get(
        "/financial/investment/recommendations"
      );
      return {
        success: true,
        recommendations:
          response.data?.recommendations ||
          "Rekomendasi investasi berhasil dibuat",
        data: response.data,
        metadata: response.data?.aiMetadata || {},
      };
    } catch (error) {
      console.error("Portfolio Analysis API Error:", error);
      return {
        success: false,
        error: "Gagal menganalisis portfolio. Silakan coba lagi.",
        recommendations:
          "Maaf, analisis investasi tidak dapat diproses saat ini.",
      };
    }
  }

  /**
   * Assess investment risk
   */
  static async assessInvestmentRisk(
    request?: RiskAssessmentRequest
  ): Promise<any> {
    try {
      const response = await apiClient.get(
        "/financial/investment/recommendations"
      );
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
      // Ensure session exists first
      if (
        !sessionId ||
        sessionId === "" ||
        sessionId === "new" ||
        sessionId.startsWith("session_")
      ) {
        console.log("No valid session ID, returning empty history");
        return [];
      }

      console.log("Loading chat history for session:", sessionId);

      const response = await apiClient.get(
        `/api/v1/chat/sessions/${sessionId}/messages`
      );

      // Transform backend format to frontend format
      const messages = response.data as any[];
      if (!Array.isArray(messages)) {
        console.log("No messages found in session");
        return [];
      }

      const transformedMessages = messages.map((msg: any) => ({
        id: msg.id || `msg_${Date.now()}`,
        content: msg.content,
        sender: (msg.role === "USER" ? "user" : "ai") as "user" | "ai",
        timestamp: new Date(msg.timestamp || msg.createdAt),
        messageType: msg.messageType || "text",
      }));

      console.log(
        "Chat history loaded:",
        transformedMessages.length,
        "messages"
      );
      return transformedMessages;
    } catch (error) {
      console.error("Chat History API Error:", error);
      // Don't throw error for history, just return empty array
      console.log("Returning empty history due to error");
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
      await apiClient.delete(`/api/v1/chat/sessions/${sessionId}`);
      return true;
    } catch (error) {
      console.error("Delete Chat Session API Error:", error);
      return false;
    }
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(): Promise<any[]> {
    try {
      const response = await apiClient.get(`/api/v1/chat/sessions`);
      return (response.data as any[]) || [];
    } catch (error) {
      console.error("Get User Sessions API Error:", error);
      return [];
    }
  }

  /**
   * Generate user ID (temporary - should come from auth)
   */
  static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default AIService;
