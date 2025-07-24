import { Injectable, Logger } from "@nestjs/common";
import {
  LangChainService,
  ChatMessage,
  ChatSession,
} from "../services/langchain.service";
import { LangSmithService } from "../services/langsmith.service";

export interface ChatRequest {
  userId: string;
  sessionId: string;
  message: string;
  context?: Record<string, any>;
  chatType?: "general" | "financial" | "consultant" | "support";
}

export interface ChatResponse {
  responseId: string;
  message: string;
  confidence: number;
  suggestedActions: string[];
  generatedAt: Date;
  metadata: Record<string, any>;
}

export interface ChatSessionSummary {
  sessionId: string;
  userId: string;
  messageCount: number;
  topics: string[];
  sentiment: "positive" | "neutral" | "negative";
  lastActivity: Date;
  summary: string;
}

@Injectable()
export class ChatAgentService {
  private readonly logger = new Logger(ChatAgentService.name);
  private readonly activeSessions = new Map<string, ChatSession>();

  constructor(
    private langChainService: LangChainService,
    private langSmithService: LangSmithService
  ) {}

  /**
   * Process a chat message and generate response
   */
  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    const responseId = `chat_${request.sessionId}_${Date.now()}`;

    try {
      this.logger.log(`Processing chat message: ${responseId}`);

      // Start tracing
      const traceId = await this.langSmithService.startTrace(
        request.sessionId,
        request.userId,
        "chat_message",
        { message: request.message, chatType: request.chatType }
      );

      // Get or create chat session
      const session = this.getOrCreateSession(
        request.userId,
        request.sessionId
      );

      // Add user message to session
      const userMessage: ChatMessage = {
        role: "user",
        content: request.message,
        timestamp: new Date(),
      };
      session.messages.push(userMessage);

      // Generate AI response based on chat type
      let aiResponse: string;
      let suggestedActions: string[] = [];

      switch (request.chatType) {
        case "financial":
          aiResponse = await this.langChainService.financialAdvisorChat(
            request.message,
            { ...request.context, chatHistory: session.messages.slice(-5) }
          );
          suggestedActions = await this.generateFinancialActions(
            request.message,
            aiResponse
          );
          break;

        case "consultant":
          const industryType = request.context?.industryType || "general";
          aiResponse = await this.langChainService.consultantChat(
            request.message,
            industryType,
            { ...request.context, chatHistory: session.messages.slice(-5) }
          );
          suggestedActions = await this.generateConsultantActions(
            request.message,
            aiResponse
          );
          break;

        case "support":
          aiResponse = await this.handleSupportChat(
            request.message,
            session.messages
          );
          suggestedActions = await this.generateSupportActions(request.message);
          break;

        default:
          aiResponse = await this.langChainService.chat([
            ...session.messages.slice(-5), // Keep last 5 messages for context
            userMessage,
          ]);
          suggestedActions = await this.generateGeneralActions(request.message);
      }

      // Add AI response to session
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      session.messages.push(assistantMessage);
      session.updatedAt = new Date();

      // Calculate confidence
      const confidence = this.calculateResponseConfidence(
        request.message,
        aiResponse,
        session
      );

      // End tracing
      await this.langSmithService.endTrace(traceId, aiResponse, true);

      const response: ChatResponse = {
        responseId,
        message: aiResponse,
        confidence,
        suggestedActions,
        generatedAt: new Date(),
        metadata: {
          chatType: request.chatType,
          sessionMessageCount: session.messages.length,
          responseLength: aiResponse.length,
        },
      };

      this.logger.log(`Chat message processed: ${responseId}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Chat processing failed: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        responseId,
        message:
          "I apologize, but I encountered an issue processing your message. Please try again.",
        confidence: 0,
        suggestedActions: [
          "Try rephrasing your message",
          "Contact support if the issue persists",
        ],
        generatedAt: new Date(),
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          chatType: request.chatType,
        },
      };
    }
  }

  /**
   * Get chat session by ID
   */
  getSession(sessionId: string): ChatSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Get chat session history
   */
  getSessionHistory(sessionId: string, limit: number = 50): ChatMessage[] {
    const session = this.activeSessions.get(sessionId);
    if (!session) return [];

    return session.messages.slice(-limit);
  }

  /**
   * Clear chat session
   */
  clearSession(sessionId: string): boolean {
    return this.activeSessions.delete(sessionId);
  }

  /**
   * Get session summary
   */
  async getSessionSummary(
    sessionId: string
  ): Promise<ChatSessionSummary | null> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    try {
      // Extract topics from messages
      const topics = await this.extractTopics(session.messages);

      // Analyze sentiment
      const sentiment = this.analyzeSentiment(session.messages);

      // Generate summary
      const summary = await this.generateSessionSummary(session.messages);

      return {
        sessionId: session.id,
        userId: session.userId,
        messageCount: session.messages.length,
        topics,
        sentiment,
        lastActivity: session.updatedAt,
        summary,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate session summary: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  /**
   * Get all active sessions for a user
   */
  getUserSessions(userId: string): ChatSession[] {
    return Array.from(this.activeSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  // Private helper methods

  private getOrCreateSession(userId: string, sessionId: string): ChatSession {
    let session = this.activeSessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        userId,
        messages: [],
        context: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.activeSessions.set(sessionId, session);
    }

    return session;
  }

  private async handleSupportChat(
    message: string,
    chatHistory: ChatMessage[]
  ): Promise<string> {
    // Create a support-specific prompt
    const systemPrompt = `You are a helpful customer support agent for Fintar, a financial management platform. 
    Help users with:
    - Account issues and login problems
    - Feature explanations and guidance
    - Technical support and troubleshooting
    - General platform questions
    
    Be professional, empathetic, and provide clear step-by-step solutions when possible.
    If you cannot resolve an issue, guide the user to contact human support.`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...chatHistory.slice(-3), // Include recent context
      { role: "user", content: message },
    ];

    return await this.langChainService.chat(messages);
  }

  private calculateResponseConfidence(
    userMessage: string,
    aiResponse: string,
    session: ChatSession
  ): number {
    let confidence = 0.8; // Base confidence

    // Increase confidence for longer, more detailed responses
    if (aiResponse.length > 100) confidence += 0.1;

    // Increase confidence for sessions with more context
    if (session.messages.length > 5) confidence += 0.05;

    // Decrease confidence for very short responses
    if (aiResponse.length < 20) confidence -= 0.3;

    // Decrease confidence for responses containing uncertainty phrases
    const uncertaintyPhrases = [
      "not sure",
      "might be",
      "possibly",
      "perhaps",
      "maybe",
    ];
    if (
      uncertaintyPhrases.some((phrase) =>
        aiResponse.toLowerCase().includes(phrase)
      )
    ) {
      confidence -= 0.2;
    }

    return Math.max(0.1, Math.min(confidence, 1.0));
  }

  private async generateFinancialActions(
    userMessage: string,
    aiResponse: string
  ): Promise<string[]> {
    const actions: string[] = [];

    if (userMessage.toLowerCase().includes("investment")) {
      actions.push(
        "View Investment Opportunities",
        "Analyze Portfolio",
        "Set Investment Goals"
      );
    } else if (userMessage.toLowerCase().includes("budget")) {
      actions.push("Create Budget Plan", "Track Expenses", "Set Savings Goals");
    } else if (userMessage.toLowerCase().includes("retirement")) {
      actions.push(
        "Retirement Calculator",
        "Plan Retirement Strategy",
        "Review Retirement Accounts"
      );
    } else {
      actions.push(
        "Financial Health Check",
        "Speak with Advisor",
        "Explore Financial Tools"
      );
    }

    return actions.slice(0, 3);
  }

  private async generateConsultantActions(
    userMessage: string,
    aiResponse: string
  ): Promise<string[]> {
    const actions: string[] = [];

    if (userMessage.toLowerCase().includes("strategy")) {
      actions.push(
        "Business Strategy Workshop",
        "Market Analysis",
        "Competitive Assessment"
      );
    } else if (userMessage.toLowerCase().includes("operations")) {
      actions.push(
        "Process Optimization",
        "Efficiency Analysis",
        "Operational Review"
      );
    } else {
      actions.push(
        "Schedule Consultation",
        "Industry Analysis",
        "Business Assessment"
      );
    }

    return actions.slice(0, 3);
  }

  private async generateSupportActions(userMessage: string): Promise<string[]> {
    const actions: string[] = [];

    if (
      userMessage.toLowerCase().includes("login") ||
      userMessage.toLowerCase().includes("password")
    ) {
      actions.push("Reset Password", "Account Recovery", "Contact Support");
    } else if (
      userMessage.toLowerCase().includes("feature") ||
      userMessage.toLowerCase().includes("how to")
    ) {
      actions.push("Feature Guide", "Tutorial Videos", "Help Documentation");
    } else {
      actions.push("Contact Support", "FAQ", "Community Forum");
    }

    return actions.slice(0, 3);
  }

  private async generateGeneralActions(userMessage: string): Promise<string[]> {
    return ["Explore Fintar Features", "Get Started Guide", "Contact Support"];
  }

  private async extractTopics(messages: ChatMessage[]): Promise<string[]> {
    const topics = new Set<string>();
    const keywordTopics = {
      investment: "Investments",
      budget: "Budgeting",
      retirement: "Retirement Planning",
      insurance: "Insurance",
      loan: "Loans",
      savings: "Savings",
      tax: "Taxes",
      portfolio: "Portfolio Management",
      consultation: "Business Consultation",
      strategy: "Strategy",
      support: "Support",
    };

    messages.forEach((message) => {
      const content = message.content.toLowerCase();
      Object.entries(keywordTopics).forEach(([keyword, topic]) => {
        if (content.includes(keyword)) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics);
  }

  private analyzeSentiment(
    messages: ChatMessage[]
  ): "positive" | "neutral" | "negative" {
    // Simple sentiment analysis based on keywords
    let positiveScore = 0;
    let negativeScore = 0;

    const positiveWords = [
      "good",
      "great",
      "excellent",
      "helpful",
      "thank",
      "perfect",
      "amazing",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "problem",
      "issue",
      "error",
      "broken",
      "frustrated",
    ];

    messages.forEach((message) => {
      if (message.role === "user") {
        const content = message.content.toLowerCase();
        positiveWords.forEach((word) => {
          if (content.includes(word)) positiveScore++;
        });
        negativeWords.forEach((word) => {
          if (content.includes(word)) negativeScore++;
        });
      }
    });

    if (positiveScore > negativeScore) return "positive";
    if (negativeScore > positiveScore) return "negative";
    return "neutral";
  }

  private async generateSessionSummary(
    messages: ChatMessage[]
  ): Promise<string> {
    if (messages.length === 0) return "No messages in this session.";

    const userMessages = messages.filter((m) => m.role === "user");
    const topics = await this.extractTopics(messages);

    let summary = `Session with ${userMessages.length} user messages`;
    if (topics.length > 0) {
      summary += `, discussing ${topics.join(", ")}`;
    }
    summary += ".";

    return summary;
  }
}
