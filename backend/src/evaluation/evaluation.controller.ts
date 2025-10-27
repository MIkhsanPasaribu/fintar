import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { EvaluationService } from "./evaluation.service";
import {
  CreateEvaluationDto,
  QualityEvaluationResult,
  EvaluationStatisticsDto,
  GetEvaluationsQueryDto,
} from "./dto/evaluation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

/**
 * Evaluation Controller
 *
 * API endpoints for AI response quality evaluation.
 *
 * Endpoints:
 * - POST /api/evaluation/evaluate - Trigger evaluation for a message
 * - GET /api/evaluation/:id - Get evaluation by ID
 * - GET /api/evaluation - Get evaluations with filters
 * - GET /api/evaluation/statistics - Get aggregated statistics
 * - GET /api/evaluation/user/:userId - Get user's evaluations
 * - DELETE /api/evaluation/:id - Delete evaluation
 *
 * @class EvaluationController
 */
@ApiTags("Evaluation")
@Controller("evaluation")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  /**
   * Trigger evaluation for a chat message
   *
   * POST /api/evaluation/evaluate
   */
  @Post("evaluate")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Evaluate AI response quality",
    description:
      "Triggers LLM-as-a-Judge evaluation for a chat message response",
  })
  @ApiResponse({
    status: 201,
    description: "Evaluation completed successfully",
    type: QualityEvaluationResult,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid message ID or message not found",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing JWT token",
  })
  async evaluateResponse(
    @Body() createEvaluationDto: CreateEvaluationDto
  ): Promise<QualityEvaluationResult> {
    return this.evaluationService.evaluateResponse(createEvaluationDto);
  }

  /**
   * Get evaluation by ID
   *
   * GET /api/evaluation/:id
   */
  @Get(":id")
  @ApiOperation({
    summary: "Get evaluation by ID",
    description: "Retrieves a specific evaluation record",
  })
  @ApiParam({
    name: "id",
    description: "Evaluation ID",
    example: "eval_123",
  })
  @ApiResponse({
    status: 200,
    description: "Evaluation found",
  })
  @ApiResponse({
    status: 404,
    description: "Evaluation not found",
  })
  async getEvaluationById(@Param("id") id: string) {
    return this.evaluationService.getEvaluationById(id);
  }

  /**
   * Get evaluations with filters and pagination
   *
   * GET /api/evaluation
   */
  @Get()
  @ApiOperation({
    summary: "Get evaluations with filters",
    description: "Retrieves evaluations with optional filtering and pagination",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    description: "Filter by user ID",
  })
  @ApiQuery({
    name: "minScore",
    required: false,
    description: "Minimum score filter (0-100)",
  })
  @ApiQuery({
    name: "maxScore",
    required: false,
    description: "Maximum score filter (0-100)",
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by evaluation status",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 20)",
  })
  @ApiResponse({
    status: 200,
    description: "Evaluations retrieved successfully",
  })
  async getEvaluations(@Query() query: GetEvaluationsQueryDto) {
    return this.evaluationService.getEvaluations(query);
  }

  /**
   * Get evaluation statistics
   *
   * GET /api/evaluation/statistics
   */
  @Get("statistics/summary")
  @ApiOperation({
    summary: "Get evaluation statistics",
    description: "Retrieves aggregated evaluation statistics",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date for statistics",
    type: Date,
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date for statistics",
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
    type: EvaluationStatisticsDto,
  })
  async getStatistics(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<EvaluationStatisticsDto> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.evaluationService.getStatistics(start, end);
  }

  /**
   * Get evaluations for a specific user
   *
   * GET /api/evaluation/user/:userId
   */
  @Get("user/:userId")
  @ApiOperation({
    summary: "Get user evaluations",
    description: "Retrieves all evaluations for a specific user",
  })
  @ApiParam({
    name: "userId",
    description: "User ID",
    example: "user_123",
  })
  @ApiResponse({
    status: 200,
    description: "User evaluations retrieved successfully",
  })
  async getUserEvaluations(@Param("userId") userId: string) {
    return this.evaluationService.getUserEvaluations(userId);
  }

  /**
   * Delete an evaluation
   *
   * DELETE /api/evaluation/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete evaluation",
    description: "Deletes an evaluation record (admin only)",
  })
  @ApiParam({
    name: "id",
    description: "Evaluation ID",
    example: "eval_123",
  })
  @ApiResponse({
    status: 204,
    description: "Evaluation deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Evaluation not found",
  })
  async deleteEvaluation(@Param("id") id: string) {
    await this.evaluationService.deleteEvaluation(id);
  }
}
