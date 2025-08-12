import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { MongodbService } from "../common/mongodb/mongodb.service";
import { BudgetDto } from "./dto/budget.dto";

@Injectable()
export class BudgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mongodb: MongodbService
  ) {}

  async getBudgetAnalysis(userId: string) {
    // Get user's profile with financial data
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return {
        error:
          "No financial data found. Please complete your financial profile first.",
        recommendations: [
          "Add your monthly income and expenses",
          "Set up your financial goals",
          "Track your spending patterns",
        ],
      };
    }

    const monthlyIncome = Number(userProfile.monthlyIncome) || 0;
    const monthlyExpenses = Number(userProfile.monthlyExpenses) || 0;
    const currentSavings = Number(userProfile.currentSavings) || 0;
    const emergencyFund = Number(userProfile.emergencyFundAmount) || 0;

    // Calculate key metrics
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate =
      monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
    const emergencyFundMonths =
      monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;

    // Budget allocation recommendations (50/30/20 rule as baseline)
    const recommendedNeeds = monthlyIncome * 0.5; // Housing, utilities, groceries, transport
    const recommendedWants = monthlyIncome * 0.3; // Entertainment, dining out, shopping
    const recommendedSavings = monthlyIncome * 0.2; // Savings, investments, debt repayment

    // Budget health score (0-100)
    let healthScore = 0;
    if (savingsRate >= 20) healthScore += 25;
    else if (savingsRate >= 10) healthScore += 15;
    else if (savingsRate >= 5) healthScore += 10;

    if (emergencyFundMonths >= 6) healthScore += 25;
    else if (emergencyFundMonths >= 3) healthScore += 15;
    else if (emergencyFundMonths >= 1) healthScore += 10;

    if (monthlyExpenses <= monthlyIncome) healthScore += 25;
    if (monthlyIncome > 0) healthScore += 25;

    return {
      summary: {
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        savingsRate: Math.round(savingsRate * 100) / 100,
        currentSavings,
        emergencyFund,
        emergencyFundMonths: Math.round(emergencyFundMonths * 10) / 10,
        healthScore: Math.min(healthScore, 100),
      },
      recommended: {
        needs: recommendedNeeds,
        wants: recommendedWants,
        savings: recommendedSavings,
      },
      analysis: {
        status: this.getBudgetStatus(savingsRate, emergencyFundMonths),
        strengths: this.getBudgetStrengths(
          savingsRate,
          emergencyFundMonths,
          monthlyIncome,
          monthlyExpenses
        ),
        improvements: this.getBudgetImprovements(
          savingsRate,
          emergencyFundMonths,
          monthlyIncome,
          monthlyExpenses
        ),
      },
    };
  }

  async simulateBudget(userId: string, budgetDto: BudgetDto) {
    const { targetIncome, allocation, period = 12, targets } = budgetDto;

    // Calculate projected outcomes
    const monthlyIncome = targetIncome || 0;
    const totalAllocated = Object.values(allocation || {}).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const monthlySavings =
      (allocation?.savings || 0) + (allocation?.emergency || 0);
    const savingsRate =
      monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

    // Project outcomes over the specified period
    const projectedSavings = monthlySavings * period;
    const projectedEmergencyFund = (allocation?.emergency || 0) * period;

    // Store simulation in MongoDB for future reference
    await this.saveBudgetSimulation(userId, {
      ...budgetDto,
      results: {
        totalAllocated,
        monthlySavings,
        savingsRate,
        projectedSavings,
        projectedEmergencyFund,
        isBalanced: totalAllocated <= monthlyIncome,
      },
      timestamp: new Date(),
    });

    return {
      input: {
        monthlyIncome,
        period,
        allocation,
        targets,
      },
      results: {
        totalAllocated,
        remaining: monthlyIncome - totalAllocated,
        monthlySavings,
        savingsRate: Math.round(savingsRate * 100) / 100,
        isBalanced: totalAllocated <= monthlyIncome,
      },
      projections: {
        totalSavings: projectedSavings,
        emergencyFund: projectedEmergencyFund,
        goalProgress: this.calculateGoalProgress(
          targets,
          monthlySavings,
          period
        ),
      },
      recommendations: this.getBudgetRecommendations(
        allocation,
        monthlyIncome,
        targets
      ),
    };
  }

  private getBudgetStatus(
    savingsRate: number,
    emergencyFundMonths: number
  ): string {
    if (savingsRate >= 20 && emergencyFundMonths >= 6) return "Excellent";
    if (savingsRate >= 15 && emergencyFundMonths >= 3) return "Good";
    if (savingsRate >= 10 && emergencyFundMonths >= 1) return "Fair";
    return "Needs Improvement";
  }

  private getBudgetStrengths(
    savingsRate: number,
    emergencyFundMonths: number,
    income: number,
    expenses: number
  ): string[] {
    const strengths: string[] = [];

    if (savingsRate >= 20) strengths.push("Excellent savings rate (20%+)");
    else if (savingsRate >= 10) strengths.push("Good savings rate (10%+)");

    if (emergencyFundMonths >= 6)
      strengths.push("Strong emergency fund (6+ months)");
    else if (emergencyFundMonths >= 3)
      strengths.push("Good emergency fund (3+ months)");

    if (expenses <= income) strengths.push("Living within means");
    if (income > 0) strengths.push("Has income source");

    return strengths.length > 0 ? strengths : ["Building financial foundation"];
  }

  private getBudgetImprovements(
    savingsRate: number,
    emergencyFundMonths: number,
    income: number,
    expenses: number
  ): string[] {
    const improvements: string[] = [];

    if (expenses > income) improvements.push("Reduce expenses to match income");
    if (savingsRate < 10)
      improvements.push("Increase savings rate to at least 10%");
    if (emergencyFundMonths < 3)
      improvements.push("Build emergency fund (3-6 months expenses)");
    if (savingsRate < 20)
      improvements.push(
        "Aim for 20% savings rate for optimal financial health"
      );

    return improvements;
  }

  private calculateGoalProgress(
    targets: any,
    monthlySavings: number,
    period: number
  ): any {
    if (!targets) return {};

    const progress: any = {};

    Object.entries(targets).forEach(([goal, targetAmount]: [string, any]) => {
      const totalSavings = monthlySavings * period;
      const progressPercentage =
        targetAmount > 0 ? (totalSavings / targetAmount) * 100 : 0;

      progress[goal] = {
        target: targetAmount,
        projected: totalSavings,
        progressPercentage: Math.round(progressPercentage * 100) / 100,
        isAchievable: totalSavings >= targetAmount,
      };
    });

    return progress;
  }

  private getBudgetRecommendations(
    allocation: any,
    income: number,
    targets: any
  ): string[] {
    const recommendations: string[] = [];

    if (!allocation) return ["Set up budget allocation across categories"];

    const housing = allocation.housing || 0;
    const savings = allocation.savings || 0;
    const entertainment = allocation.entertainment || 0;

    if (housing > income * 0.3) {
      recommendations.push(
        "Consider reducing housing costs (currently above 30% of income)"
      );
    }

    if (savings < income * 0.2) {
      recommendations.push(
        "Increase savings allocation to at least 20% of income"
      );
    }

    if (entertainment > income * 0.1) {
      recommendations.push("Consider reducing entertainment expenses");
    }

    if (targets && Object.keys(targets).length === 0) {
      recommendations.push(
        "Set specific financial targets to guide your budget"
      );
    }

    return recommendations;
  }

  private async saveBudgetSimulation(userId: string, simulationData: any) {
    const db = this.mongodb.getDb();
    const simulationsCollection = db.collection("budget_simulations");

    await simulationsCollection.insertOne({
      userId,
      ...simulationData,
    });
  }
}
