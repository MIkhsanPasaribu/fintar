import { Controller, Post, Body, Get, UseGuards, Logger } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RuleBasedAdvisorService } from "./rule-based-advisor.service";
import {
  BudgetAdviceDto,
  InvestmentAdviceDto,
  EmergencyFundAdviceDto,
  DebtAdviceDto,
  SavingsGoalAdviceDto,
  FinancialPlanningAdviceDto,
  GenericAdviceDto,
  AdviceResponseDto,
} from "./dto/baseline.dto";

@ApiTags("Baseline System (Rule-Based)")
@Controller("baseline")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BaselineController {
  private readonly logger = new Logger(BaselineController.name);

  constructor(private readonly ruleBasedAdvisor: RuleBasedAdvisorService) {}

  @Post("budget-advice")
  @ApiOperation({
    summary: "Get budget advice (rule-based)",
    description:
      "Simple rule-based budget advice for comparison with AI system",
  })
  @ApiResponse({
    status: 200,
    description: "Budget advice generated successfully",
    type: AdviceResponseDto,
  })
  getBudgetAdvice(@Body() dto: BudgetAdviceDto): AdviceResponseDto {
    this.logger.log(
      `Generating budget advice: income=${dto.income}, expenses=${dto.expenses}`
    );

    const advice = this.ruleBasedAdvisor.getBudgetAdvice(
      dto.income,
      dto.expenses
    );

    return {
      advice,
      source: "rule-based",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("investment-advice")
  @ApiOperation({
    summary: "Get investment advice (rule-based)",
    description:
      "Simple rule-based investment advice based on age and risk tolerance",
  })
  @ApiResponse({
    status: 200,
    description: "Investment advice generated successfully",
    type: AdviceResponseDto,
  })
  getInvestmentAdvice(@Body() dto: InvestmentAdviceDto): AdviceResponseDto {
    this.logger.log(
      `Generating investment advice: age=${dto.age}, income=${dto.monthlyIncome}, risk=${dto.riskTolerance}`
    );

    const advice = this.ruleBasedAdvisor.getInvestmentAdvice(
      dto.age,
      dto.monthlyIncome,
      dto.riskTolerance
    );

    return {
      advice,
      source: "rule-based",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("emergency-fund-advice")
  @ApiOperation({
    summary: "Get emergency fund advice (rule-based)",
    description: "Simple rule-based emergency fund recommendations",
  })
  @ApiResponse({
    status: 200,
    description: "Emergency fund advice generated successfully",
    type: AdviceResponseDto,
  })
  getEmergencyFundAdvice(
    @Body() dto: EmergencyFundAdviceDto
  ): AdviceResponseDto {
    this.logger.log(
      `Generating emergency fund advice: expenses=${dto.monthlyExpenses}, savings=${dto.currentSavings}`
    );

    const advice = this.ruleBasedAdvisor.getEmergencyFundAdvice(
      dto.monthlyExpenses,
      dto.currentSavings
    );

    return {
      advice,
      source: "rule-based",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("debt-advice")
  @ApiOperation({
    summary: "Get debt management advice (rule-based)",
    description: "Simple rule-based debt management recommendations",
  })
  @ApiResponse({
    status: 200,
    description: "Debt advice generated successfully",
    type: AdviceResponseDto,
  })
  getDebtAdvice(@Body() dto: DebtAdviceDto): AdviceResponseDto {
    this.logger.log(
      `Generating debt advice: debt=${dto.totalDebt}, income=${dto.monthlyIncome}`
    );

    const advice = this.ruleBasedAdvisor.getDebtAdvice(
      dto.totalDebt,
      dto.monthlyIncome
    );

    return {
      advice,
      source: "rule-based",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("savings-goal-advice")
  @ApiOperation({
    summary: "Get savings goal advice (rule-based)",
    description: "Simple calculation for savings goal",
  })
  @ApiResponse({
    status: 200,
    description: "Savings goal advice generated successfully",
    type: AdviceResponseDto,
  })
  getSavingsGoalAdvice(@Body() dto: SavingsGoalAdviceDto): AdviceResponseDto {
    this.logger.log(
      `Generating savings goal advice: goal=${dto.goalAmount}, timeframe=${dto.timeframeMonths}`
    );

    const advice = this.ruleBasedAdvisor.getSavingsGoalAdvice(
      dto.goalAmount,
      dto.timeframeMonths,
      dto.currentSavings
    );

    return {
      advice,
      source: "rule-based",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("financial-planning-advice")
  @ApiOperation({
    summary: "Get comprehensive financial planning advice (rule-based)",
    description: "Holistic financial planning based on simple rules",
  })
  @ApiResponse({
    status: 200,
    description: "Financial planning advice generated successfully",
    type: AdviceResponseDto,
  })
  getFinancialPlanningAdvice(
    @Body() dto: FinancialPlanningAdviceDto
  ): AdviceResponseDto {
    this.logger.log(
      `Generating financial planning advice: age=${dto.age}, income=${dto.monthlyIncome}`
    );

    const advice = this.ruleBasedAdvisor.getFinancialPlanningAdvice(
      dto.age,
      dto.monthlyIncome,
      dto.monthlyExpenses,
      dto.hasEmergencyFund,
      dto.hasInsurance
    );

    return {
      advice,
      source: "rule-based",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("generic-advice")
  @ApiOperation({
    summary: "Get generic advice based on question (rule-based)",
    description: "Keyword-based generic financial advice (fallback)",
  })
  @ApiResponse({
    status: 200,
    description: "Generic advice generated successfully",
    type: AdviceResponseDto,
  })
  getGenericAdvice(@Body() dto: GenericAdviceDto): AdviceResponseDto {
    this.logger.log(`Generating generic advice for question: ${dto.question}`);

    const advice = this.ruleBasedAdvisor.getGenericAdvice(dto.question);

    return {
      advice,
      source: "rule-based",
      timestamp: new Date().toISOString(),
    };
  }
}
