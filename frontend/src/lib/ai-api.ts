/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./api-client";

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
      console.log("🔄 Creating new chat session for user:", userId);

      const requestData = {
        title: "Fintar AI Chat Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: userId,
        },
      };

      console.log("📤 Sending session creation request:", requestData);

      const response = await apiClient.createChatSession(requestData);

      console.log("📥 Raw session creation response:", response);
      console.log("📋 Response data:", response.data);

      if (!response.success || !response.data) {
        console.error("❌ Session creation failed:", response);
        throw new Error(response.error || "Failed to create chat session");
      }

      // The api-client returns the session object
      const responseData = response.data;
      const sessionId = responseData?._id || responseData?.sessionId;

      if (!sessionId) {
        console.error("❌ Session creation response missing ID:", {
          responseData: responseData,
          fullResponse: response,
        });
        throw new Error("No session ID returned from backend");
      }

      console.log("✅ Chat session created successfully:", sessionId);
      return sessionId;
    } catch (error: any) {
      console.error("❌ Error creating chat session:", error);

      // Log more details about the error
      if (error?.response) {
        console.error("Backend error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
          config: error.response.config,
        });
      }

      // Create better error message
      if (error?.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error?.response?.status === 500) {
        throw new Error("Server error occurred while creating chat session.");
      } else if (error?.code === "NETWORK_ERROR") {
        throw new Error("Network error. Please check your connection.");
      }

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
        console.log("🔄 Creating new session for user:", request.userId);
        currentSessionId = await this.createChatSession(request.userId);
      }

      console.log("📤 Sending message to session:", currentSessionId);

      // Send the message to backend
      const response = await apiClient.sendChatMessage(
        currentSessionId,
        request.message
      );

      // Backend response format from test: { userMessage, aiMessage, sessionInfo }
      const data = response.data;

      if (!response.success || !data) {
        throw new Error(response.error || "Invalid response from AI service");
      }

      // Extract AI message from backend response
      let aiMessage;
      if (data.aiMessage) {
        // Backend format: { userMessage, aiMessage, sessionInfo }
        aiMessage = data.aiMessage;
      } else if (data.response) {
        // Fallback format
        aiMessage = { content: data.response };
      } else if (typeof data === 'string') {
        // Direct string response
        aiMessage = { content: data };
      } else {
        // Unknown format
        aiMessage = { content: "Sorry, I couldn't process your request." };
      }

      // Format response for frontend
      const aiResponse: ChatResponse = {
        response:
          aiMessage.content || "Sorry, I couldn't process your request.",
        messageType: aiMessage.metadata?.messageType || "text",
        suggestions: aiMessage.metadata?.suggestions || [],
        analysisData: aiMessage.metadata?.analysisData,
        sessionId: currentSessionId,
        timestamp: aiMessage.timestamp || new Date().toISOString(),
      };

      console.log("✅ AI response received:", aiResponse);
      return aiResponse;
    } catch (error: any) {
      console.error("❌ Error sending message:", error);

      if (error?.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error?.response?.status === 404) {
        throw new Error(
          "Chat session not found. Please start a new conversation."
        );
      }

      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Get chat history for a session
   */
  static async getChatHistory(
    userId: string,
    sessionId: string
  ): Promise<ChatMessage[]> {
    try {
      console.log("📥 Loading chat history for session:", sessionId);

      const response = await apiClient.getChatHistory(sessionId);

      const messages = response.success ? response.data || [] : [];

      // Convert backend messages to frontend format
      const chatHistory: ChatMessage[] = messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role === "USER" ? "user" : "ai",
        timestamp: new Date(msg.timestamp),
        messageType: msg.metadata?.messageType || "text",
        suggestions: msg.metadata?.suggestions || [],
      }));

      console.log("✅ Chat history loaded:", chatHistory.length, "messages");
      return chatHistory;
    } catch (error: any) {
      console.error("❌ Error loading chat history:", error);

      if (error?.response?.status === 404) {
        console.log("📝 No chat history found, starting fresh");
        return [];
      }

      throw new Error(`Failed to load chat history: ${error.message}`);
    }
  }

  /**
   * Delete chat session
   */
  static async deleteChatSession(
    userId: string,
    sessionId: string
  ): Promise<void> {
    try {
      // Note: This feature is not implemented in api-client yet
      console.log("⚠️ Delete session functionality not yet implemented");
      console.log("Session deletion requested for:", sessionId);
    } catch (error: any) {
      console.error("❌ Error deleting chat session:", error);
      throw new Error(`Failed to delete chat session: ${error.message}`);
    }
  }

  /**
   * Get user's chat sessions
   */
  static async getUserSessions(): Promise<any[]> {
    try {
      const response = await apiClient.getChatSessions();
      return response.success ? response.data || [] : [];
    } catch (error: any) {
      console.error("❌ Error loading user sessions:", error);
      return [];
    }
  }

  // Financial Analysis Methods (TODO: Implement with proper API client)
  static async analyzeFinancialData(
    request: FinancialAnalysisRequest
  ): Promise<any> {
    console.log("⚠️ Financial analysis not yet implemented:", request);
    throw new Error("Financial analysis feature is not yet available");
  }

  static async getFinancialAdvice(
    request: FinancialAdviceRequest
  ): Promise<any> {
    console.log("⚠️ Financial advice not yet implemented:", request);
    throw new Error("Financial advice feature is not yet available");
  }

  static async getBudgetRecommendations(
    request: BudgetRecommendationRequest
  ): Promise<any> {
    console.log("⚠️ Budget recommendations not yet implemented:", request);
    throw new Error("Budget recommendations feature is not yet available");
  }

  static async analyzePortfolio(
    request: PortfolioAnalysisRequest
  ): Promise<any> {
    console.log("⚠️ Portfolio analysis not yet implemented:", request);
    throw new Error("Portfolio analysis feature is not yet available");
  }

  static async assessInvestmentRisk(
    request: RiskAssessmentRequest
  ): Promise<any> {
    console.log("⚠️ Investment risk assessment not yet implemented:", request);
    throw new Error("Investment risk assessment feature is not yet available");
  }
}

export default AIService;
