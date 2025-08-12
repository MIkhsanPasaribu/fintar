import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongoClient, Db } from "mongodb";

@Injectable()
export class MongodbService implements OnModuleInit {
  private readonly logger = new Logger(MongodbService.name);
  private client: MongoClient;
  private db: Db;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const mongoUrl =
        this.configService.get<string>("MONGODB_URI") ||
        this.configService.get<string>("MONGODB_URL") ||
        "mongodb://localhost:27017";
      const dbName =
        this.configService.get<string>("MONGODB_DB_NAME") || "fintar";

      // Mask sensitive credentials in logs
      const maskedUrl = mongoUrl.replace(/\/\/[^@]*@/, "//*****@");
      this.logger.log(`🔗 Connecting to MongoDB: ${maskedUrl}`);

      this.client = new MongoClient(mongoUrl, {
        serverSelectionTimeoutMS: 8000, // Increased timeout
        connectTimeoutMS: 15000, // Increased timeout
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        w: "majority",
        appName: "fintar-backend",
      });

      // Test the connection
      await this.client.connect();
      await this.client.db(dbName).admin().ping();
      this.db = this.client.db(dbName);

      // Create indexes for better performance
      await this.createIndexes();

      this.logger.log("✅ Successfully connected to MongoDB Atlas database");
    } catch (error) {
      this.logger.error(
        "❌ Failed to connect to MongoDB database:",
        error instanceof Error ? error.message : String(error)
      );

      // Always continue in fallback mode for development
      this.logger.warn(
        "⚠️ MongoDB connection failed - continuing in fallback mode (data will be stored temporarily)"
      );

      // Don't throw error, just log and continue
      this.client = null;
      this.db = null;
    }
  }

  private async createIndexes() {
    try {
      if (!this.db) return;

      // Create indexes for chat collections
      await this.db
        .collection("chat_sessions")
        .createIndex({ userId: 1, createdAt: -1 });
      await this.db
        .collection("chat_messages")
        .createIndex({ sessionId: 1, timestamp: -1 });
      await this.db
        .collection("ai_analytics")
        .createIndex({ userId: 1, timestamp: -1 });

      this.logger.log("📊 MongoDB indexes created successfully");
    } catch (error) {
      this.logger.warn(
        "⚠️ Failed to create MongoDB indexes:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  getDatabase(): Db | null {
    if (!this.db) {
      this.logger.warn(
        "⚠️ MongoDB connection not available - using fallback mode"
      );
      return null;
    }
    return this.db;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
      this.logger.log("🔌 Disconnected from MongoDB database");
    }
  }

  getDb(): Db {
    if (!this.db) {
      this.logger.warn("⚠️ MongoDB not available - returning null");
      return null;
    }
    return this.db;
  }

  getClient(): MongoClient {
    if (!this.client) {
      this.logger.warn("⚠️ MongoDB client not available");
      return null;
    }
    return this.client;
  }

  isConnected(): boolean {
    return !!this.db && !!this.client;
  }

  // Chat Sessions Collection
  get chatSessions() {
    if (!this.db) {
      this.logger.warn(
        "⚠️ MongoDB not available - chat sessions collection unavailable"
      );
      return null;
    }
    return this.db.collection("chat_sessions");
  }

  // Chat Messages Collection
  get chatMessages() {
    if (!this.db) {
      this.logger.warn(
        "⚠️ MongoDB not available - chat messages collection unavailable"
      );
      return null;
    }
    return this.db.collection("chat_messages");
  }

  // AI Analytics Collection
  get aiAnalytics() {
    if (!this.db) {
      this.logger.warn(
        "⚠️ MongoDB not available - AI analytics collection unavailable"
      );
      return null;
    }
    return this.db.collection("ai_analytics");
  }

  // Helper methods for common operations
  async saveChatSession(sessionData: any) {
    if (!this.chatSessions) return null;
    try {
      const result = await this.chatSessions.insertOne({
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return result.insertedId;
    } catch (error) {
      this.logger.error(
        "Failed to save chat session:",
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  async saveChatMessage(messageData: any) {
    if (!this.chatMessages) return null;
    try {
      const result = await this.chatMessages.insertOne({
        ...messageData,
        timestamp: new Date(),
      });
      return result.insertedId;
    } catch (error) {
      this.logger.error(
        "Failed to save chat message:",
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  async saveAiAnalytics(analyticsData: any) {
    if (!this.aiAnalytics) return null;
    try {
      const result = await this.aiAnalytics.insertOne({
        ...analyticsData,
        timestamp: new Date(),
      });
      return result.insertedId;
    } catch (error) {
      this.logger.error(
        "Failed to save AI analytics:",
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  async getChatHistory(userId: string, sessionId?: string, limit = 50) {
    if (!this.chatMessages) return [];
    try {
      const filter: any = { userId };
      if (sessionId) filter.sessionId = sessionId;

      const messages = await this.chatMessages
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      this.logger.error(
        "Failed to get chat history:",
        error instanceof Error ? error.message : String(error)
      );
      return [];
    }
  }

  async getUserChatSessions(userId: string, limit = 20) {
    if (!this.chatSessions) return [];
    try {
      const sessions = await this.chatSessions
        .find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .toArray();

      return sessions;
    } catch (error) {
      this.logger.error(
        "Failed to get user chat sessions:",
        error instanceof Error ? error.message : String(error)
      );
      return [];
    }
  }
}
