import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Log AI interactions and analytics
  async logAIAnalytics(data: {
    userId: string;
    sessionId?: string;
    type: string;
    action: string;
    data: any;
    metadata?: any;
  }) {
    try {
      await this.prisma.aIAnalytics.create({
        data: {
          userId: data.userId,
          sessionId: data.sessionId,
          type: data.type,
          action: data.action,
          data: data.data,
          metadata: data.metadata,
        },
      });
    } catch (error) {
      this.logger.error("Failed to log AI analytics:", error);
    }
  }

  // Get user analytics
  async getUserAnalytics(userId: string) {
    try {
      const analytics = await this.prisma.aIAnalytics.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: 100, // Limit to recent 100 entries
      });

      return analytics;
    } catch (error) {
      this.logger.error("Failed to get user analytics:", error);
      return [];
    }
  }

  // Get session analytics
  async getSessionAnalytics(sessionId: string) {
    try {
      const analytics = await this.prisma.aIAnalytics.findMany({
        where: { sessionId },
        orderBy: { timestamp: "desc" },
      });

      return analytics;
    } catch (error) {
      this.logger.error("Failed to get session analytics:", error);
      return [];
    }
  }

  // Store chat session data
  async storeChatSession(userId: string, sessionData: any) {
    try {
      console.log("Analytics: Creating chat session:", {
        userId,
        sessionData,
      });

      const session = await this.prisma.chatSession.create({
        data: {
          userId,
          title: sessionData.title || "New Chat",
          type: sessionData.type || "GENERAL",
          metadata: sessionData.metadata || {},
        },
      });

      console.log("Analytics: Chat session created successfully:", session);
      return session;
    } catch (error) {
      this.logger.error("Failed to store chat session:", error);
      console.error("Analytics: Error details:", error);
      throw error;
    }
  }

  // Store chat message
  async storeChatMessage(sessionId: string, messageData: any) {
    try {
      return await this.prisma.chatMessage.create({
        data: {
          sessionId,
          role: messageData.role,
          content: messageData.content,
          metadata: messageData.metadata || {},
        },
      });
    } catch (error) {
      this.logger.error("Failed to store chat message:", error);
      throw error;
    }
  }

  // Get chat session with messages
  async getChatSession(sessionId: string) {
    try {
      return await this.prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { timestamp: "asc" },
          },
        },
      });
    } catch (error) {
      this.logger.error("Failed to get chat session:", error);
      return null;
    }
  }

  // Get user chat sessions
  async getUserChatSessions(userId: string) {
    try {
      return await this.prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        include: {
          messages: {
            take: 1,
            orderBy: { timestamp: "desc" },
          },
        },
      });
    } catch (error) {
      this.logger.error("Failed to get user chat sessions:", error);
      return [];
    }
  }

  // Clean up old analytics data
  async cleanupOldAnalytics(daysOld: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.aIAnalytics.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log(`Cleaned up ${result.count} old analytics records`);
      return result;
    } catch (error) {
      this.logger.error("Failed to cleanup old analytics:", error);
      return { count: 0 };
    }
  }
}
