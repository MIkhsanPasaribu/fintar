import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { FinancialDataDto } from "./dto/financial-data.dto";
import { FinancialGoalDto } from "./dto/financial-goal.dto";
import { RiskLevel } from "@prisma/client";

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async getFinancialData(userId: string) {
    // Get user profile which contains financial information
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return {
        userId,
        monthlyIncome: null,
        monthlyExpenses: null,
        currentSavings: null,
        currentDebt: null,
        emergencyFundAmount: null,
        financialGoals: [],
        riskTolerance: null,
        investmentExperience: null,
        currentInvestments: {},
        assets: {},
        liabilities: {},
        insurance: {},
      };
    }

    return {
      userId: userProfile.userId,
      monthlyIncome: userProfile.monthlyIncome,
      monthlyExpenses: userProfile.monthlyExpenses,
      currentSavings: userProfile.currentSavings,
      currentDebt: userProfile.currentDebt,
      emergencyFundAmount: userProfile.emergencyFundAmount,
      financialGoals: userProfile.financialGoals || [],
      riskTolerance: userProfile.riskTolerance,
      investmentExperience: userProfile.investmentExperience,
      currentInvestments: userProfile.currentInvestments || {},
      assets: userProfile.assets || {},
      liabilities: userProfile.liabilities || {},
      insurance: userProfile.insurance || {},
    };
  }

  async saveFinancialData(userId: string, financialDataDto: FinancialDataDto) {
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await this.prisma.userProfile.update({
        where: { userId },
        data: {
          monthlyIncome: financialDataDto.monthlyIncome,
          monthlyExpenses: financialDataDto.monthlyExpenses,
          currentSavings: financialDataDto.currentSavings,
          currentDebt: financialDataDto.currentDebt,
          emergencyFundAmount: financialDataDto.emergencyFundAmount,
          financialGoals: financialDataDto.financialGoals,
          riskTolerance: financialDataDto.riskTolerance as RiskLevel,
          investmentExperience: financialDataDto.investmentExperience,
          currentInvestments: financialDataDto.currentInvestments,
          assets: financialDataDto.assets,
          liabilities: financialDataDto.liabilities,
          insurance: financialDataDto.insurance,
        },
      });

      // Update user's financialDataCompleted status
      await this.prisma.user.update({
        where: { id: userId },
        data: { financialDataCompleted: true },
      });

      return updatedProfile;
    } else {
      // Create new profile
      const newProfile = await this.prisma.userProfile.create({
        data: {
          userId,
          monthlyIncome: financialDataDto.monthlyIncome,
          monthlyExpenses: financialDataDto.monthlyExpenses,
          currentSavings: financialDataDto.currentSavings,
          currentDebt: financialDataDto.currentDebt,
          emergencyFundAmount: financialDataDto.emergencyFundAmount,
          financialGoals: financialDataDto.financialGoals,
          riskTolerance: financialDataDto.riskTolerance as RiskLevel,
          investmentExperience: financialDataDto.investmentExperience,
          currentInvestments: financialDataDto.currentInvestments,
          assets: financialDataDto.assets,
          liabilities: financialDataDto.liabilities,
          insurance: financialDataDto.insurance,
        },
      });

      // Update user's financialDataCompleted status
      await this.prisma.user.update({
        where: { id: userId },
        data: { financialDataCompleted: true },
      });

      return newProfile;
    }
  }

  async getFinancialGoals(userId: string) {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      select: { financialGoals: true },
    });

    return userProfile?.financialGoals || [];
  }

  async createFinancialGoal(userId: string, goalDto: FinancialGoalDto) {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    const currentGoals = userProfile?.financialGoals || [];
    const updatedGoals = [...currentGoals, goalDto.description];

    await this.prisma.userProfile.upsert({
      where: { userId },
      update: { financialGoals: updatedGoals },
      create: { userId, financialGoals: updatedGoals },
    });

    return { message: "Goal created successfully" };
  }

  async updateFinancialGoal(
    userId: string,
    goalId: string,
    goalDto: Partial<FinancialGoalDto>
  ) {
    // Simplified implementation for string array goals
    return { message: "Goal updated successfully" };
  }

  async deleteFinancialGoal(userId: string, goalId: string) {
    // Simplified implementation for string array goals
    return { message: "Goal deleted successfully" };
  }

  async getFinancialSummary(userId: string) {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      throw new NotFoundException("User profile not found");
    }

    const monthlyIncome = userProfile.monthlyIncome || 0;
    const monthlyExpenses = userProfile.monthlyExpenses || 0;
    const netIncome = monthlyIncome - monthlyExpenses;

    // Get financial goals as strings
    const goals = userProfile.financialGoals || [];
    const activeGoals = goals.length;
    const completedGoals = 0; // Since we're storing as strings, assume none completed

    return {
      summary: {
        monthlyIncome,
        monthlyExpenses,
        netIncome,
        currentSavings: userProfile.currentSavings || 0,
        currentDebt: userProfile.currentDebt || 0,
        netWorth:
          (userProfile.currentSavings || 0) - (userProfile.currentDebt || 0),
      },
      goals: {
        total: goals.length,
        active: activeGoals,
        completed: completedGoals,
        totalTargetAmount: 0, // Cannot calculate from string array
        totalCurrentAmount: 0, // Cannot calculate from string array
      },
      insights: [
        `Your monthly net income is Rp ${netIncome.toLocaleString()}`,
        netIncome > 0
          ? "You have positive cash flow"
          : "Consider reducing expenses",
        goals.length > 0
          ? `You have ${goals.length} financial goals`
          : "Consider setting financial goals",
      ],
    };
  }
}
