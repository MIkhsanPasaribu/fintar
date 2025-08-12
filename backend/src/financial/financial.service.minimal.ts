import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) {}

  async getFinancialData(userId: string) {
    try {
      // Get user profile with financial information
      const profile = await this.prisma.userProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          currentSavings: 0,
          currentDebt: 0,
          emergencyFundAmount: 0,
          assets: {},
          liabilities: {},
          currency: "IDR",
        };
      }

      return {
        monthlyIncome: profile.monthlyIncome || 0,
        monthlyExpenses: profile.monthlyExpenses || 0,
        currentSavings: profile.currentSavings || 0,
        currentDebt: profile.currentDebt || 0,
        emergencyFundAmount: profile.emergencyFundAmount || 0,
        assets: profile.assets || {},
        liabilities: profile.liabilities || {},
        currency: profile.currency || "IDR",
      };
    } catch (error) {
      console.error("Error getting financial data:", error);
      return {
        monthlyIncome: 0,
        monthlyExpenses: 0,
        currentSavings: 0,
        currentDebt: 0,
        emergencyFundAmount: 0,
        assets: {},
        liabilities: {},
        currency: "IDR",
      };
    }
  }

  async saveFinancialData(userId: string, data: any) {
    try {
      // Update or create user profile with financial data
      const result = await this.prisma.userProfile.upsert({
        where: { userId },
        update: {
          monthlyIncome: data.monthlyIncome,
          monthlyExpenses: data.monthlyExpenses,
          currentSavings: data.currentSavings,
          currentDebt: data.currentDebt,
          emergencyFundAmount: data.emergencyFundAmount,
          financialGoals: data.financialGoals || [],
          riskTolerance: data.riskTolerance,
          investmentExperience: data.investmentExperience,
          assets: data.assets,
          liabilities: data.liabilities,
        },
        create: {
          userId,
          monthlyIncome: data.monthlyIncome,
          monthlyExpenses: data.monthlyExpenses,
          currentSavings: data.currentSavings,
          currentDebt: data.currentDebt,
          emergencyFundAmount: data.emergencyFundAmount,
          financialGoals: data.financialGoals || [],
          riskTolerance: data.riskTolerance,
          investmentExperience: data.investmentExperience,
          assets: data.assets,
          liabilities: data.liabilities,
        },
      });

      return result;
    } catch (error) {
      console.error("Error saving financial data:", error);
      throw error;
    }
  }

  async getFinancialSummary(userId: string) {
    try {
      const financialData = await this.getFinancialData(userId);

      const totalAssets = Object.values(financialData.assets || {}).reduce(
        (sum: number, value: any) => sum + Number(value || 0),
        0
      );

      const totalLiabilities = Object.values(
        financialData.liabilities || {}
      ).reduce((sum: number, value: any) => sum + Number(value || 0), 0);

      const netWorth = totalAssets - totalLiabilities;
      const savingsRate =
        financialData.monthlyIncome > 0
          ? ((financialData.monthlyIncome - financialData.monthlyExpenses) /
              financialData.monthlyIncome) *
            100
          : 0;

      return {
        totalAssets,
        totalLiabilities,
        netWorth,
        currentSavings: financialData.currentSavings || 0,
        currentDebt: financialData.currentDebt || 0,
        monthlyIncome: financialData.monthlyIncome || 0,
        monthlyExpenses: financialData.monthlyExpenses || 0,
        savingsRate,
        emergencyFundAmount: financialData.emergencyFundAmount || 0,
        currency: financialData.currency,
      };
    } catch (error) {
      console.error("Error getting financial summary:", error);
      throw error;
    }
  }

  async getInvestmentRecommendations(userId: string) {
    try {
      const financialData = await this.getFinancialData(userId);

      const recommendations = [
        {
          type: "emergency_fund",
          title: "Dana Darurat",
          description: "Simpan 6-12 bulan pengeluaran untuk dana darurat",
          priority: "high",
          amount: (financialData.monthlyExpenses || 0) * 6,
          risk: "low",
        },
        {
          type: "index_fund",
          title: "Reksa Dana Indeks",
          description: "Diversifikasi investasi dengan reksa dana indeks",
          priority: "medium",
          amount: (financialData.monthlyIncome || 0) * 0.2,
          risk: "medium",
        },
        {
          type: "government_bonds",
          title: "Obligasi Pemerintah",
          description: "Investasi aman dengan return yang stabil",
          priority: "medium",
          amount: (financialData.monthlyIncome || 0) * 0.1,
          risk: "low",
        },
      ];

      return recommendations;
    } catch (error) {
      console.error("Error getting investment recommendations:", error);
      return [];
    }
  }

  // Placeholder methods for other endpoints
  async getGoals(userId: string) {
    return [];
  }

  async createGoal(userId: string, goalData: any) {
    return { id: "goal_" + Date.now(), ...goalData, userId };
  }

  async updateGoal(userId: string, goalId: string, goalData: any) {
    return { id: goalId, ...goalData, userId };
  }

  async deleteGoal(userId: string, goalId: string) {
    return { success: true };
  }

  async getAIInsights(userId: string) {
    return {
      insights: [
        "Tingkatkan dana darurat Anda",
        "Pertimbangkan diversifikasi investasi",
        "Monitor pengeluaran bulanan",
      ],
    };
  }

  async createAIPlan(userId: string, planData: any) {
    return {
      plan: "Rencana keuangan AI berhasil dibuat",
      recommendations: ["Mulai investasi", "Kurangi pengeluaran tidak perlu"],
    };
  }
}
