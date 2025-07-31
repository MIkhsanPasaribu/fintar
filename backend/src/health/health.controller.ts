import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PrismaService } from "../common/prisma/prisma.service";
import { MongodbService } from "../common/mongodb/mongodb.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mongodb: MongodbService
  ) {}

  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({
    status: 200,
    description: "Service health status",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        timestamp: { type: "string", example: "2025-07-30T13:10:00.000Z" },
        services: {
          type: "object",
          properties: {
            database: { type: "string", example: "connected" },
            mongodb: { type: "string", example: "connected" },
            api: { type: "string", example: "running" },
          },
        },
        version: { type: "string", example: "1.0.0" },
      },
    },
  })
  async getHealth() {
    let dbStatus = "disconnected";
    let mongoStatus = "disconnected";

    // Test PostgreSQL connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch (error) {
      dbStatus = "error";
    }

    // Test MongoDB connection
    try {
      if (this.mongodb.isConnected()) {
        mongoStatus = "connected";
      } else {
        mongoStatus = "fallback_mode";
      }
    } catch (error) {
      mongoStatus = "error";
    }

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        mongodb: mongoStatus,
        api: "running",
      },
      version: "1.0.0",
      uptime: process.uptime(),
    };
  }
}
