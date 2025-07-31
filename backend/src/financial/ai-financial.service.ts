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
      throw new Error(
        `Failed to generate comprehensive insights: ${error instanceof Error ? error.message : "Unknown error"}`
      );
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
}
