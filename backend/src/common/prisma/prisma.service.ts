import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      this.logger.log("🔗 Connecting to PostgreSQL database via Prisma...");
      await this.$connect();
      this.logger.log("✅ Connected to PostgreSQL database via Prisma");
    } catch (error) {
      this.logger.error("❌ Failed to connect to PostgreSQL database:", error);

      // For development, you can make this non-fatal if needed
      if (process.env.NODE_ENV === "development") {
        this.logger.warn("⚠️ PostgreSQL connection failed in development mode");
        // Uncomment the next line if you want to continue without DB in dev
        // return;
      }

      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("🔌 Disconnected from PostgreSQL database");
  }
}
