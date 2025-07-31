import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { AnalyticsService } from "../common/analytics/analytics.service";
import { CreateChatSessionDto, ChatType } from "./dto/chat-session.dto";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService
  ) {}

  // Map DTO enum to Prisma enum
  private mapChatTypeToPrisma(dtoType: ChatType | string): string {
    const mapping = {
      [ChatType.FINANCIAL_PLANNING]: "FINANCIAL_ADVICE",
      [ChatType.INVESTMENT_ADVICE]: "INVESTMENT_HELP",
      [ChatType.BUDGET_HELP]: "BUDGET_PLANNING",
      [ChatType.GENERAL]: "GENERAL",
    };
    return mapping[dtoType as ChatType] || "GENERAL";
  }

  async createSession(userId: string, createSessionDto: CreateChatSessionDto) {
    try {
      const prismaType = this.mapChatTypeToPrisma(
        createSessionDto.type || ChatType.GENERAL
      );

      const session = await this.analyticsService.storeChatSession(userId, {
        title: createSessionDto.title || "New Chat",
        type: prismaType,
        metadata: createSessionDto.metadata || {},
      });

      // Log analytics
      await this.analyticsService.logAIAnalytics({
        userId,
        sessionId: session.id,
        type: "chat_interaction",
        action: "session_created",
        data: { title: session.title, type: session.type },
      });

      return session;
    } catch (error) {
      throw new Error("Failed to create chat session");
    }
  }

  async getSessions(userId: string) {
    try {
      return await this.analyticsService.getUserChatSessions(userId);
    } catch (error) {
      return [];
    }
  }

  async getSession(sessionId: string, userId: string) {
    try {
      const session = await this.analyticsService.getChatSession(sessionId);

      if (!session) {
        throw new NotFoundException("Chat session not found");
      }

      if (session.userId !== userId) {
        throw new ForbiddenException("Access denied to this chat session");
      }

      return session;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new Error("Failed to get chat session");
    }
  }

  async getMessages(sessionId: string, userId: string) {
    try {
      const session = await this.getSession(sessionId, userId);
      return session.messages || [];
    } catch (error) {
      throw error;
    }
  }

  async addMessage(sessionId: string, userId: string, messageData: any) {
    try {
      // Verify session ownership
      await this.getSession(sessionId, userId);

      // Store message
      const message = await this.analyticsService.storeChatMessage(sessionId, {
        role: messageData.role,
        content: messageData.content,
        metadata: messageData.metadata || {},
      });

      // Log analytics
      await this.analyticsService.logAIAnalytics({
        userId,
        sessionId,
        type: "chat_interaction",
        action: "message_sent",
        data: {
          role: messageData.role,
          contentLength: messageData.content.length,
        },
      });

      return message;
    } catch (error) {
      throw new Error("Failed to add message");
    }
  }

  async deleteSession(sessionId: string, userId: string) {
    try {
      // Verify session ownership
      const session = await this.getSession(sessionId, userId);

      // Delete session (cascade will delete messages)
      await this.prisma.chatSession.delete({
        where: { id: sessionId },
      });

      // Log analytics
      await this.analyticsService.logAIAnalytics({
        userId,
        sessionId,
        type: "chat_interaction",
        action: "session_deleted",
        data: { sessionTitle: session.title },
      });

      return { message: "Chat session deleted successfully" };
    } catch (error) {
      throw new Error("Failed to delete chat session");
    }
  }

  // Analytics methods
  async logAIAnalytics(data: any) {
    return this.analyticsService.logAIAnalytics(data);
  }

  async getUserAnalytics(userId: string) {
    return this.analyticsService.getUserAnalytics(userId);
  }

  // Helper method to calculate message metrics
  async getMessageMetrics(userId: string) {
    try {
      const sessions = await this.analyticsService.getUserChatSessions(userId);
      const totalSessions = sessions.length;
      const totalMessages = sessions.reduce(
        (sum, session) => sum + (session.messages?.length || 0),
        0
      );

      const lastActivity = sessions.length > 0 ? sessions[0].updatedAt : null;

      return {
        totalMessages,
        totalSessions,
        averageMessagesPerSession:
          totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0,
        lastActivityDate: lastActivity,
      };
    } catch (error) {
      return {
        totalMessages: 0,
        totalSessions: 0,
        averageMessagesPerSession: 0,
        lastActivityDate: null,
      };
    }
  }

  // Helper method to get chat session analytics
  async getChatAnalytics(userId: string) {
    try {
      const analytics = await this.analyticsService.getUserAnalytics(userId);

      // Process daily message counts
      const dailyMessageCounts = this.processDailyMessageCounts(analytics);

      // Process topic distribution
      const topicDistribution = this.processTopicDistribution(analytics);

      return {
        dailyMessageCounts,
        topicDistribution,
        averageSessionDuration: 0, // To be implemented
      };
    } catch (error) {
      return {
        dailyMessageCounts: [],
        topicDistribution: [],
        averageSessionDuration: 0,
      };
    }
  }

  private processDailyMessageCounts(analytics: any[]) {
    const dailyCounts: { [key: string]: number } = {};

    analytics.forEach((item) => {
      if (item.action === "message_sent") {
        const date = item.timestamp.toISOString().split("T")[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      }
    });

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private processTopicDistribution(analytics: any[]) {
    const topicCounts: { [key: string]: number } = {};

    analytics.forEach((item) => {
      if (item.type) {
        topicCounts[item.type] = (topicCounts[item.type] || 0) + 1;
      }
    });

    return Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count,
    }));
  }
}
