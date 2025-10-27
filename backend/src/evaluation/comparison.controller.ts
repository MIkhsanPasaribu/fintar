import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  Req,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ComparisonService } from "./comparison.service";
import { StatisticalAnalysisService } from "./statistical-analysis.service";
import {
  RunComparisonDto,
  ComparisonResultDto,
  ComparisonStatisticsDto,
  GetComparisonStatisticsDto,
} from "./dto/comparison.dto";

@ApiTags("Comparison (AI vs Baseline)")
@Controller("comparison")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComparisonController {
  private readonly logger = new Logger(ComparisonController.name);

  constructor(
    private readonly comparisonService: ComparisonService,
    private readonly statisticalAnalysis: StatisticalAnalysisService
  ) {}

  @Post("run")
  @ApiOperation({
    summary: "Run comparison between AI and baseline systems",
    description:
      "Send same question to both Fintar AI and rule-based baseline system, evaluate both responses using LLM-as-judge, and return comparison results.",
  })
  @ApiResponse({
    status: 201,
    description: "Comparison completed successfully",
    type: ComparisonResultDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async runComparison(
    @Body() dto: RunComparisonDto,
    @Req() req: any
  ): Promise<ComparisonResultDto> {
    const userId = req.user?.userId || req.user?.sub;
    this.logger.log(
      `Running comparison for user ${userId}: "${dto.questionText.substring(0, 50)}..."`
    );

    return this.comparisonService.runComparison(dto, userId);
  }

  @Get("results/:id")
  @ApiOperation({
    summary: "Get comparison result by ID",
    description:
      "Retrieve detailed comparison result including responses and scores.",
  })
  @ApiResponse({
    status: 200,
    description: "Comparison result retrieved successfully",
    type: ComparisonResultDto,
  })
  @ApiResponse({ status: 404, description: "Comparison result not found" })
  async getComparisonById(
    @Param("id") id: string
  ): Promise<ComparisonResultDto> {
    this.logger.log(`Fetching comparison result: ${id}`);
    return this.comparisonService.getComparisonById(id);
  }

  @Get("user/:userId")
  @ApiOperation({
    summary: "Get comparison results for a user",
    description:
      "Retrieve all comparison results for a specific user (latest first).",
  })
  @ApiResponse({
    status: 200,
    description: "User comparison results retrieved successfully",
    type: [ComparisonResultDto],
  })
  async getUserComparisons(
    @Param("userId") userId: string,
    @Query("limit") limit?: number
  ): Promise<ComparisonResultDto[]> {
    this.logger.log(
      `Fetching comparisons for user: ${userId}, limit: ${limit || 50}`
    );
    return this.comparisonService.getUserComparisons(userId, limit);
  }

  @Get("statistics")
  @ApiOperation({
    summary: "Get comparison statistics",
    description:
      "Retrieve aggregated statistics comparing AI vs baseline performance. Includes win rates, average scores, score breakdown by criteria, and statistical measures.",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
    type: ComparisonStatisticsDto,
  })
  async getStatistics(
    @Query() query: GetComparisonStatisticsDto
  ): Promise<ComparisonStatisticsDto> {
    this.logger.log("Fetching comparison statistics");

    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.comparisonService.getComparisonStatistics(startDate, endDate);
  }

  @Get("statistical-analysis")
  @ApiOperation({
    summary: "Get statistical analysis (t-test, effect size, CI)",
    description:
      "Perform comprehensive statistical analysis on comparison results. " +
      "Includes independent samples t-test, Cohen's d effect size, 95% confidence intervals, " +
      "and journal-ready statistical statements. Perfect for research paper analysis.",
  })
  @ApiResponse({
    status: 200,
    description: "Statistical analysis completed successfully",
  })
  async getStatisticalAnalysis(
    @Query() query: GetComparisonStatisticsDto
  ): Promise<any> {
    this.logger.log("Performing statistical analysis on comparison results");

    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    // Get all comparison results
    const comparisons = await this.comparisonService.getRawComparisons(
      startDate,
      endDate
    );

    if (comparisons.length < 2) {
      return {
        error:
          "Insufficient data for statistical analysis (minimum 2 comparisons required)",
        sampleSize: comparisons.length,
      };
    }

    const aiScores = comparisons.map((c) => c.aiOverallScore);
    const baselineScores = comparisons.map((c) => c.baselineOverallScore);

    // Perform statistical analysis
    const analysis = this.statisticalAnalysis.performAnalysis(
      aiScores,
      baselineScores
    );

    return {
      ...analysis,
      dataRange: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
