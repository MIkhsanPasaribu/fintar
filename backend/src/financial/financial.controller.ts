import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FinancialService } from "./financial.service";
import { BudgetService } from "./budget.service";
import { InvestmentService } from "./investment.service";
import { AIFinancialService } from "./ai-financial.service";
import { FinancialDataDto } from "./dto/financial-data.dto";
import { BudgetDto } from "./dto/budget.dto";
import { InvestmentPlanDto } from "./dto/investment-plan.dto";
import { FinancialGoalDto } from "./dto/financial-goal.dto";

@ApiTags("financial")
@Controller("financial")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class FinancialController {
  constructor(
    private readonly financialService: FinancialService,
    private readonly budgetService: BudgetService,
    private readonly investmentService: InvestmentService,
    private readonly aiFinancialService: AIFinancialService
  ) {}

  @Get("data")
  @ApiOperation({ summary: "Get user financial data" })
  @ApiResponse({
    status: 200,
    description: "Financial data retrieved successfully",
  })
  async getFinancialData(@Request() req) {
    return this.financialService.getFinancialData(req.user.id);
  }

  @Post("data")
  @ApiOperation({ summary: "Create/update financial data" })
  @ApiResponse({
    status: 200,
    description: "Financial data saved successfully",
  })
  async saveFinancialData(
    @Request() req,
    @Body() financialDataDto: FinancialDataDto
  ) {
    return this.financialService.saveFinancialData(
      req.user.id,
      financialDataDto
    );
  }

  @Get("summary")
  @ApiOperation({ summary: "Get financial summary" })
  @ApiResponse({
    status: 200,
    description: "Financial summary retrieved successfully",
  })
  async getFinancialSummary(@Request() req) {
    return this.financialService.getFinancialSummary(req.user.id);
  }

  @Get("investment/recommendations")
  @ApiOperation({ summary: "Get investment recommendations" })
  @ApiResponse({
    status: 200,
    description: "Investment recommendations retrieved successfully",
  })
  async getInvestmentRecommendationsSimple(@Request() req) {
    return this.investmentService.getInvestmentRecommendations(req.user.id);
  }

  @Get("budget")
  @ApiOperation({ summary: "Get budget analysis" })
  @ApiResponse({
    status: 200,
    description: "Budget analysis retrieved successfully",
  })
  async getBudgetAnalysis(@Request() req) {
    return this.budgetService.getBudgetAnalysis(req.user.id);
  }

  @Post("budget/simulate")
  @ApiOperation({ summary: "Simulate budget scenarios" })
  @ApiResponse({ status: 200, description: "Budget simulation completed" })
  async simulateBudget(@Request() req, @Body() budgetDto: BudgetDto) {
    return this.budgetService.simulateBudget(req.user.id, budgetDto);
  }

  @Get("budget/ai-recommendations")
  @ApiOperation({ summary: "Get AI budget recommendations" })
  @ApiResponse({
    status: 200,
    description: "AI budget recommendations generated",
  })
  async getAIBudgetRecommendations(@Request() req) {
    return this.aiFinancialService.generateBudgetRecommendations(req.user.id);
  }

  @Get("investments")
  @ApiOperation({ summary: "Get investment recommendations" })
  @ApiResponse({
    status: 200,
    description: "Investment recommendations retrieved",
  })
  async getInvestmentRecommendations(@Request() req) {
    return this.investmentService.getInvestmentRecommendations(req.user.id);
  }

  @Post("investments/analyze")
  @ApiOperation({ summary: "Analyze investment strategy" })
  @ApiResponse({ status: 200, description: "Investment strategy analyzed" })
  async analyzeInvestmentStrategy(
    @Request() req,
    @Body() investmentDto: InvestmentPlanDto
  ) {
    return this.aiFinancialService.analyzeInvestmentStrategy(
      req.user.id,
      investmentDto
    );
  }

  @Get("goals")
  @ApiOperation({ summary: "Get financial goals" })
  @ApiResponse({
    status: 200,
    description: "Financial goals retrieved successfully",
  })
  async getFinancialGoals(@Request() req) {
    return this.financialService.getFinancialGoals(req.user.id);
  }

  @Post("goals")
  @ApiOperation({ summary: "Create financial goal" })
  @ApiResponse({
    status: 201,
    description: "Financial goal created successfully",
  })
  async createFinancialGoal(@Request() req, @Body() goalDto: FinancialGoalDto) {
    return this.financialService.createFinancialGoal(req.user.id, goalDto);
  }

  @Patch("goals/:goalId")
  @ApiOperation({ summary: "Update financial goal" })
  @ApiResponse({
    status: 200,
    description: "Financial goal updated successfully",
  })
  async updateFinancialGoal(
    @Request() req,
    @Param("goalId") goalId: string,
    @Body() goalDto: Partial<FinancialGoalDto>
  ) {
    return this.financialService.updateFinancialGoal(
      req.user.id,
      goalId,
      goalDto
    );
  }

  @Get("ai-insights")
  @ApiOperation({ summary: "Get comprehensive AI financial insights" })
  @ApiResponse({ status: 200, description: "AI financial insights generated" })
  async getAIFinancialInsights(@Request() req) {
    return this.aiFinancialService.generateComprehensiveInsights(req.user.id);
  }

  @Post("ai-plan")
  @ApiOperation({ summary: "Generate AI financial plan" })
  @ApiResponse({ status: 200, description: "AI financial plan generated" })
  async generateAIFinancialPlan(
    @Request() req,
    @Query("duration") duration?: string
  ) {
    return this.aiFinancialService.generateFinancialPlan(req.user.id, duration);
  }

  @Get("investment/ai-recommendations")
  @ApiOperation({ summary: "Get comprehensive AI investment recommendations" })
  @ApiResponse({
    status: 200,
    description: "AI investment recommendations generated",
  })
  async getAIInvestmentRecommendations(@Request() req) {
    return this.aiFinancialService.generateInvestmentRecommendations(
      req.user.id
    );
  }

  @Post("investment/ai-analyze")
  @ApiOperation({ summary: "Analyze portfolio with AI" })
  @ApiResponse({ status: 200, description: "Portfolio analysis completed" })
  async analyzePortfolioWithAI(@Request() req, @Body() portfolioData?: any) {
    return this.aiFinancialService.analyzePortfolioWithAI(
      req.user.id,
      portfolioData
    );
  }

  @Get("investment/market-trends")
  @ApiOperation({ summary: "Get AI market trend analysis" })
  @ApiResponse({ status: 200, description: "Market trend analysis completed" })
  async getMarketTrendAnalysis(@Request() req) {
    return this.aiFinancialService.getMarketTrendAnalysis(req.user.id);
  }
}
