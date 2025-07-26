import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("✅ Connected to PostgreSQL database via Prisma");
    } catch (error) {
      this.logger.error("❌ Failed to connect to PostgreSQL database:", error);

      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("permission denied")) {
        this.logger.error(
          "Database permission denied. Please check database user permissions."
        );
      } else if (errorMessage.includes("timeout")) {
        this.logger.error(
          "Database connection timeout. Please check database availability."
        );
      }

      // Don't throw error here to allow app to start with fallback auth
      this.logger.warn(
        "Application starting with limited database functionality"
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log("❌ Disconnected from PostgreSQL database");
    } catch (error) {
      this.logger.error("Error disconnecting from database:", error);
    }
  }
}
