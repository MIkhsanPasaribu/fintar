import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { PerformanceMetricsService } from "./performance-metrics.service";

/**
 * Analytics Controller
 * Provides REST API endpoints for system performance metrics
 */
@ApiTags("Analytics")
@ApiBearerAuth()
@Controller("analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly performanceMetrics: PerformanceMetricsService) {}

  /**
   * Get comprehensive performance metrics
   */
  @Get("performance")
  @ApiOperation({
    summary: "Get performance metrics",
    description:
      "Get aggregated performance metrics including response time, token usage, success rate, errors, and quality scores for a date range",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (ISO 8601 format). Default: 7 days ago",
    example: "2025-10-14T00:00:00Z",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (ISO 8601 format). Default: now",
    example: "2025-10-21T23:59:59Z",
  })
  @ApiResponse({
    status: 200,
    description: "Performance metrics retrieved successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
  })
  async getPerformanceMetrics(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    return this.performanceMetrics.getPerformanceMetrics(startDate, endDate);
  }

  /**
   * Get response time statistics
   */
  @Get("response-time")
  @ApiOperation({
    summary: "Get response time statistics",
    description:
      "Get detailed response time stats including average, median, p95, p99",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (ISO 8601 format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (ISO 8601 format)",
  })
  @ApiResponse({
    status: 200,
    description: "Response time stats retrieved successfully",
  })
  async getResponseTimeStats(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return this.performanceMetrics.getResponseTimeStats(startDate, endDate);
  }

  /**
   * Get token usage statistics
   */
  @Get("token-usage")
  @ApiOperation({
    summary: "Get token usage statistics",
    description:
      "Get token usage stats including total tokens, requests, and estimated cost",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (ISO 8601 format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (ISO 8601 format)",
  })
  @ApiResponse({
    status: 200,
    description: "Token usage stats retrieved successfully",
  })
  async getTokenUsageStats(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days for cost tracking

    return this.performanceMetrics.getTokenUsageStats(startDate, endDate);
  }

  /**
   * Get success rate statistics
   */
  @Get("success-rate")
  @ApiOperation({
    summary: "Get success rate statistics",
    description: "Get success/failure rate for AI requests",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (ISO 8601 format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (ISO 8601 format)",
  })
  @ApiResponse({
    status: 200,
    description: "Success rate stats retrieved successfully",
  })
  async getSuccessRateStats(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return this.performanceMetrics.getSuccessRateStats(startDate, endDate);
  }

  /**
   * Get error distribution
   */
  @Get("errors")
  @ApiOperation({
    summary: "Get error distribution",
    description: "Get breakdown of errors by type",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (ISO 8601 format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (ISO 8601 format)",
  })
  @ApiResponse({
    status: 200,
    description: "Error distribution retrieved successfully",
  })
  async getErrorDistribution(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return this.performanceMetrics.getErrorDistribution(startDate, endDate);
  }

  /**
   * Get quality score statistics
   */
  @Get("quality-scores")
  @ApiOperation({
    summary: "Get quality score statistics",
    description: "Get average quality scores across all evaluation criteria",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (ISO 8601 format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (ISO 8601 format)",
  })
  @ApiResponse({
    status: 200,
    description: "Quality scores retrieved successfully",
  })
  async getQualityScoreStats(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return this.performanceMetrics.getQualityScoreStats(startDate, endDate);
  }

  /**
   * Get daily metrics for time-series charts
   */
  @Get("daily")
  @ApiOperation({
    summary: "Get daily metrics",
    description:
      "Get daily aggregated metrics for time-series visualization (requests, success rate, avg response time)",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (ISO 8601 format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (ISO 8601 format)",
  })
  @ApiResponse({
    status: 200,
    description: "Daily metrics retrieved successfully",
  })
  async getDailyMetrics(
    @Query("startDate") startDateStr?: string,
    @Query("endDate") endDateStr?: string
  ) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days for trends

    return this.performanceMetrics.getDailyMetrics(startDate, endDate);
  }
}
