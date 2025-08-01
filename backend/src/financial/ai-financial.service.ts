import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { GeminiService, FinancialContext } from "../common/ai/gemini.service";

@Injectable()
export class AIFinancialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService
  ) {}

  async generateBudgetRecommendations(userId: string) {
    try {
      // Get user and financial data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const financialData = await this.prisma.financialData.findFirst({
        where: { userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Prepare context for AI
      const context = this.prepareFinancialContext(user, financialData);

      // Generate AI recommendations
      const aiResponse =
        await this.geminiService.generateFinancialAdvice(context);

      const recommendations = this.parseBudgetRecommendations(
        aiResponse.content
      );

      return {
        success: true,
        recommendations,
        aiMetadata: {
          model: aiResponse.model,
          tokens: aiResponse.tokens,
          confidence: aiResponse.confidence,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to generate budget recommendations: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async analyzeInvestmentOpportunities(userId: string) {
    try {
      // Get user and financial data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const financialData = await this.prisma.financialData.findFirst({
        where: { userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Prepare context for AI
      const context = this.prepareFinancialContext(user, financialData);

      // Generate investment analysis
      const aiResponse =
        await this.geminiService.createInvestmentStrategy(context);

      const analysis = this.parseInvestmentAnalysis(aiResponse.content);

      return {
        success: true,
        analysis,
        aiMetadata: {
          model: aiResponse.model,
          tokens: aiResponse.tokens,
          confidence: aiResponse.confidence,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to analyze investment opportunities: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async analyzeInvestmentStrategy(userId: string, investmentDto: any) {
    try {
      // Get user and financial data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const financialData = await this.prisma.financialData.findFirst({
        where: { userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Prepare context for AI with investment plan data
      const context = this.prepareFinancialContext(user, financialData);
      const enhancedContext = {
        ...context,
        investmentPlan: investmentDto,
      };

      // Generate investment strategy analysis
      const aiResponse =
        await this.geminiService.createInvestmentStrategy(enhancedContext);

      const strategy = this.parseInvestmentAnalysis(aiResponse.content);

      return {
        success: true,
        strategy,
        aiMetadata: {
          model: aiResponse.model,
          tokens: aiResponse.tokens,
          confidence: aiResponse.confidence,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to analyze investment strategy: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async generateComprehensiveInsights(userId: string) {
    try {
      // Get user and financial data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const financialData = await this.prisma.financialData.findFirst({
        where: { userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if Gemini is available
      if (!this.geminiService.isGeminiAvailable()) {
        return this.generateFallbackInsights(user, financialData);
      }

      // Prepare context for AI
      const context = this.prepareFinancialContext(user, financialData);

      // Generate comprehensive financial insights
      const aiResponse =
        await this.geminiService.generateFinancialAdvice(context);

      const insights = this.parseInvestmentAnalysis(aiResponse.content);

      return {
        success: true,
        insights,
        aiMetadata: {
          model: aiResponse.model,
          tokens: aiResponse.tokens,
          confidence: aiResponse.confidence,
        },
      };
    } catch (error) {
      console.error("Failed to generate AI insights, using fallback:", error);

      // Try to get user data for fallback
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const financialData = await this.prisma.financialData.findFirst({
        where: { userId },
      });

      return this.generateFallbackInsights(user, financialData);
    }
  }

  async generateFinancialPlan(userId: string, duration: string) {
    try {
      // Get user and financial data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const financialData = await this.prisma.financialData.findFirst({
        where: { userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Prepare context for AI with duration
      const context = this.prepareFinancialContext(user, financialData);
      const enhancedContext = {
        ...context,
        planDuration: duration,
      };

      // Generate financial plan
      const aiResponse =
        await this.geminiService.generateFinancialAdvice(enhancedContext);

      const plan = this.parseBudgetRecommendations(aiResponse.content);

      return {
        success: true,
        plan,
        aiMetadata: {
          model: aiResponse.model,
          tokens: aiResponse.tokens,
          confidence: aiResponse.confidence,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to generate financial plan: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private prepareFinancialContext(
    user: any,
    financialData: any
  ): FinancialContext {
    return {
      monthlyIncome: financialData?.monthlyIncome
        ? Number(financialData.monthlyIncome)
        : undefined,
      monthlyExpenses: financialData?.monthlyExpenses
        ? Number(financialData.monthlyExpenses)
        : undefined,
      currentSavings: financialData?.currentSavings
        ? Number(financialData.currentSavings)
        : undefined,
      financialGoals: financialData?.financialGoals || [],
      riskTolerance: financialData?.riskTolerance || undefined,
      age: user?.profile?.dateOfBirth
        ? this.calculateAge(user.profile.dateOfBirth)
        : undefined,
      occupation: user?.profile?.occupation || undefined,
      dependents: user?.profile?.dependents || 0,
    };
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  private parseBudgetRecommendations(aiResponse: string): any {
    return {
      summary: aiResponse.substring(0, 500),
      recommendations: this.extractRecommendations(aiResponse),
      budgetAllocation: this.extractBudgetAllocation(aiResponse),
    };
  }

  private parseInvestmentAnalysis(aiResponse: string): any {
    return {
      summary: aiResponse.substring(0, 500),
      opportunities: this.extractInvestmentOpportunities(aiResponse),
      riskAssessment: this.extractRiskAssessment(aiResponse),
    };
  }

  private extractRecommendations(text: string): string[] {
    const recommendations = [];
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
        recommendations.push(line.trim());
      }
    }
    return recommendations;
  }

  private extractBudgetAllocation(text: string): any {
    return {
      necessities: 50,
      savings: 20,
      discretionary: 30,
    };
  }

  private extractInvestmentOpportunities(text: string): string[] {
    return this.extractRecommendations(text);
  }

  private extractRiskAssessment(text: string): any {
    return {
      level: "moderate",
      factors: ["market volatility", "economic conditions"],
    };
  }

  private generateFallbackInsights(user: any, financialData: any) {
    const profile = user?.profile;
    const income = profile?.monthlyIncome || 0;
    const expenses = profile?.monthlyExpenses || 0;
    const savings = profile?.currentSavings || 0;
    const debt = profile?.currentDebt || 0;

    // Calculate basic financial metrics
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const debtToIncomeRatio = income > 0 ? (debt / (income * 12)) * 100 : 0;
    const emergencyFundMonths = expenses > 0 ? savings / expenses : 0;

    // Generate basic insights based on financial rules
    const insights = this.generateBasicFinancialInsights(
      income,
      expenses,
      savings,
      debt,
      savingsRate,
      debtToIncomeRatio,
      emergencyFundMonths
    );

    return {
      success: true,
      insights: {
        summary: insights.summary,
        opportunities: insights.recommendations,
        riskAssessment: insights.riskAssessment,
        financialMetrics: {
          savingsRate: savingsRate.toFixed(1),
          debtToIncomeRatio: debtToIncomeRatio.toFixed(1),
          emergencyFundMonths: emergencyFundMonths.toFixed(1),
        },
      },
      aiMetadata: {
        model: "fallback-rules-based",
        tokens: 0,
        confidence: 0.7,
        source: "built-in-financial-rules",
      },
    };
  }

  private generateBasicFinancialInsights(
    income: number,
    expenses: number,
    savings: number,
    debt: number,
    savingsRate: number,
    debtToIncomeRatio: number,
    emergencyFundMonths: number
  ) {
    const recommendations = [];
    let riskLevel = "low";
    let summary = "";

    // Emergency Fund Analysis
    if (emergencyFundMonths < 3) {
      recommendations.push(
        "Prioritaskan membangun dana darurat minimal 3-6 bulan pengeluaran"
      );
      riskLevel = "high";
    } else if (emergencyFundMonths < 6) {
      recommendations.push(
        "Tingkatkan dana darurat menjadi 6 bulan pengeluaran"
      );
      riskLevel = "moderate";
    }

    // Savings Rate Analysis
    if (savingsRate < 10) {
      recommendations.push(
        "Tingkatkan tingkat menabung minimal 10% dari pendapatan"
      );
      riskLevel = "high";
    } else if (savingsRate < 20) {
      recommendations.push(
        "Target tingkat menabung 20% untuk kondisi keuangan yang optimal"
      );
      if (riskLevel !== "high") riskLevel = "moderate";
    } else {
      recommendations.push(
        "Tingkat menabung Anda sudah baik, pertimbangkan investasi"
      );
    }

    // Debt Analysis
    if (debtToIncomeRatio > 40) {
      recommendations.push(
        "Utang Anda terlalu tinggi, prioritaskan pelunasan utang"
      );
      riskLevel = "high";
    } else if (debtToIncomeRatio > 20) {
      recommendations.push(
        "Pertimbangkan strategi pelunasan utang lebih cepat"
      );
      if (riskLevel !== "high") riskLevel = "moderate";
    }

    // Investment Recommendations
    if (
      savingsRate >= 20 &&
      emergencyFundMonths >= 6 &&
      debtToIncomeRatio < 20
    ) {
      recommendations.push("Kondisi keuangan baik, saatnya mulai berinvestasi");
      recommendations.push(
        "Pertimbangkan reksadana atau instrumen investasi jangka panjang"
      );
    }

    // Generate summary
    if (riskLevel === "high") {
      summary = `Kondisi keuangan Anda memerlukan perhatian khusus. Fokus pada pembangunan dana darurat dan pengurangan utang adalah prioritas utama saat ini.`;
    } else if (riskLevel === "moderate") {
      summary = `Kondisi keuangan Anda cukup baik dengan beberapa area yang perlu diperbaiki. Lanjutkan kebiasaan menabung dan pertimbangkan optimisasi pengeluaran.`;
    } else {
      summary = `Kondisi keuangan Anda dalam kondisi baik. Saatnya mempertimbangkan strategi investasi untuk pertumbuhan kekayaan jangka panjang.`;
    }

    return {
      summary,
      recommendations,
      riskAssessment: {
        level: riskLevel,
        factors: ["emergency fund", "savings rate", "debt ratio"],
        recommendations: recommendations.slice(0, 3),
      },
    };
  }
}
