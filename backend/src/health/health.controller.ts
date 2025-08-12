import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
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
        message: { type: "string", example: "Fintar API is running" },
        version: { type: "string", example: "1.0.0" },
      },
    },
  })
  async getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Fintar API is running on Vercel",
      version: "1.0.0",
    };
  }
}
