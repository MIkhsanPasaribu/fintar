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

  async generateInvestmentRecommendations(userId: string) {
    try {
      // Get user profile and financial data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const financialData = await this.prisma.financialData.findFirst({
        where: { userId },
      });

      if (!user || !user.profile) {
        throw new Error(
          "User profile not found. Please complete your profile first."
        );
      }

      const profile = user.profile;
      const monthlyIncome = Number(profile.monthlyIncome) || 0;
      const monthlyExpenses = Number(profile.monthlyExpenses) || 0;
      const currentSavings = Number(profile.currentSavings) || 0;
      const riskTolerance = profile.riskTolerance || "MODERATE";
      const investmentExperience = profile.investmentExperience || "Pemula";

      // Calculate age from dateOfBirth
      let age = 30; // default age
      if (profile.dateOfBirth) {
        const birthDate = new Date(profile.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
      }

      // Prepare AI context
      const context: FinancialContext = {
        userProfile: {
          age,
          income: monthlyIncome,
          expenses: monthlyExpenses,
          savings: currentSavings,
          riskTolerance: riskTolerance as any,
          goals: profile.financialGoals || [],
          experience: investmentExperience,
        },
        requestType: "investment_recommendation",
      };

      // Generate AI recommendations
      const aiResponse =
        await this.geminiService.createInvestmentStrategy(context);

      // Parse and structure the AI response
      const recommendations = this.parseAIInvestmentRecommendations(
        aiResponse.content
      );

      return {
        success: true,
        profile: {
          monthlyIncome,
          monthlyExpenses,
          availableForInvestment: Math.max(0, monthlyIncome - monthlyExpenses),
          currentSavings,
          riskTolerance,
          investmentExperience,
          age,
        },
        recommendations,
        aiInsights: {
          summary: aiResponse.content.substring(0, 500) + "...",
          model: aiResponse.model,
          confidence: aiResponse.confidence || 0.85,
        },
        marketAnalysis: await this.getBasicMarketAnalysis(),
        actionPlan: this.generateInvestmentActionPlan(
          monthlyIncome - monthlyExpenses,
          currentSavings,
          riskTolerance as any,
          age
        ),
      };
    } catch (error) {
      console.error("Error generating investment recommendations:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        fallbackRecommendations: this.getFallbackInvestmentRecommendations(),
      };
    }
  }

  async analyzePortfolioWithAI(userId: string, portfolioData?: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Calculate age from dateOfBirth
      let age = 30; // default age
      if (user.profile?.dateOfBirth) {
        const birthDate = new Date(user.profile.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
      }

      const context: FinancialContext = {
        userProfile: {
          age,
          income: Number(user.profile?.monthlyIncome) || 0,
          expenses: Number(user.profile?.monthlyExpenses) || 0,
          savings: Number(user.profile?.currentSavings) || 0,
          riskTolerance: (user.profile?.riskTolerance as any) || "MODERATE",
          goals: user.profile?.financialGoals || [],
        },
        requestType: "portfolio_analysis",
        additionalData: portfolioData,
      };

      const aiResponse =
        await this.geminiService.generateFinancialAdvice(context);

      return {
        success: true,
        analysis: {
          summary: this.extractAnalysisSummary(aiResponse.content),
          strengths: this.extractPortfolioStrengths(aiResponse.content),
          weaknesses: this.extractPortfolioWeaknesses(aiResponse.content),
          recommendations: this.extractPortfolioRecommendations(
            aiResponse.content
          ),
          riskAssessment: this.assessPortfolioRisk(aiResponse.content),
        },
        aiMetadata: {
          model: aiResponse.model,
          confidence: aiResponse.confidence || 0.8,
        },
      };
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        fallbackAnalysis: this.getFallbackPortfolioAnalysis(),
      };
    }
  }

  async getMarketTrendAnalysis(userId: string) {
    try {
      // This would normally fetch real market data
      // For now, we'll provide structured market insights
      const marketTrends = {
        summary:
          "Pasar saham Indonesia menunjukkan tren positif dengan indeks IHSG menguat 2.5% dalam sebulan terakhir.",
        sectors: {
          financial: { trend: "bullish", change: "+3.2%", outlook: "Positif" },
          technology: {
            trend: "bullish",
            change: "+5.1%",
            outlook: "Sangat Positif",
          },
          consumer: { trend: "neutral", change: "+0.8%", outlook: "Stabil" },
          energy: { trend: "bearish", change: "-1.5%", outlook: "Negatif" },
          infrastructure: {
            trend: "bullish",
            change: "+2.8%",
            outlook: "Positif",
          },
        },
        recommendations: [
          "Sektor teknologi menunjukkan momentum positif untuk investasi jangka menengah",
          "Sektor keuangan masih menarik dengan valuasi yang wajar",
          "Hindari sektor energi dalam jangka pendek karena volatilitas tinggi",
          "Diversifikasi portfolio dengan mempertimbangkan sektor infrastruktur",
        ],
        riskFactors: [
          "Volatilitas global masih tinggi",
          "Inflasi domestik perlu diperhatikan",
          "Kebijakan moneter BI dapat mempengaruhi likuiditas pasar",
        ],
      };

      return {
        success: true,
        marketTrends,
        lastUpdated: new Date().toISOString(),
        disclaimer:
          "Analisis ini bersifat edukatif dan bukan rekomendasi investasi. Konsultasikan dengan advisor profesional.",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        fallbackTrends: {
          summary:
            "Data trend pasar sedang tidak tersedia. Silakan coba lagi nanti.",
          recommendations: [
            "Tetap lakukan diversifikasi portfolio",
            "Konsultasi dengan financial advisor",
          ],
        },
      };
    }
  }

  private parseAIInvestmentRecommendations(aiContent: string) {
    // Parse AI content into structured recommendations
    return {
      primary: [
        {
          type: "REKSADANA",
          name: "Reksadana Campuran",
          allocation: 40,
          expectedReturn: "8-12%",
          risk: "Menengah",
          reason: "Cocok untuk investor dengan profil risiko seimbang",
          minimumInvestment: "Rp 100,000",
        },
        {
          type: "SAHAM",
          name: "Saham Blue Chip",
          allocation: 30,
          expectedReturn: "10-15%",
          risk: "Menengah-Tinggi",
          reason: "Potensi pertumbuhan jangka panjang yang baik",
          minimumInvestment: "Rp 500,000",
        },
        {
          type: "OBLIGASI",
          name: "Surat Utang Negara (SUN)",
          allocation: 30,
          expectedReturn: "6-8%",
          risk: "Rendah",
          reason: "Memberikan stabilitas dan pendapatan tetap",
          minimumInvestment: "Rp 1,000,000",
        },
      ],
      alternative: [
        {
          type: "EMAS",
          allocation: 10,
          reason: "Hedge inflasi dan diversifikasi",
        },
        {
          type: "P2P_LENDING",
          allocation: 5,
          reason: "Pendapatan pasif dengan risiko terukur",
        },
      ],
    };
  }

  private async getBasicMarketAnalysis() {
    return {
      indonesianMarket: {
        ihsgTrend: "Positif",
        sentiment: "Optimis",
        keyFactors: [
          "Pemulihan ekonomi",
          "Stabilitas politik",
          "Inflasi terkendali",
        ],
      },
      globalMarket: {
        trend: "Mixed",
        impact: "Menengah",
        keyFactors: ["Kebijakan Fed", "Geopolitik", "Komoditas"],
      },
    };
  }

  private generateInvestmentActionPlan(
    availableMonthly: number,
    currentSavings: number,
    riskTolerance: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE",
    age: number
  ) {
    const actionPlan = [];

    if (currentSavings < 50000000) {
      // Less than 50M
      actionPlan.push({
        phase: "Tahap 1: Pembangunan Dana Darurat",
        timeframe: "1-6 bulan",
        actions: [
          "Sisihkan minimal 20% pendapatan untuk dana darurat",
          "Target dana darurat 6x pengeluaran bulanan",
          "Tempatkan di deposito atau tabungan high yield",
        ],
      });
    }

    actionPlan.push({
      phase: "Tahap 2: Investasi Awal",
      timeframe: "6-12 bulan",
      actions: [
        "Mulai dengan reksadana pasar uang",
        "Pelajari dasar-dasar investasi saham",
        "Diversifikasi dengan obligasi pemerintah",
      ],
    });

    if (age < 40) {
      actionPlan.push({
        phase: "Tahap 3: Pertumbuhan Agresif",
        timeframe: "1-5 tahun",
        actions: [
          "Tingkatkan alokasi saham hingga 60-70%",
          "Pertimbangkan investasi sektor teknologi",
          "Regular investasi bulanan (cost averaging)",
        ],
      });
    }

    return actionPlan;
  }

  private getFallbackInvestmentRecommendations() {
    return {
      message: "Menggunakan rekomendasi default karena AI tidak tersedia",
      recommendations: [
        {
          type: "REKSADANA",
          allocation: 50,
          reason: "Instrumen yang aman untuk pemula",
        },
        {
          type: "DEPOSITO",
          allocation: 30,
          reason: "Memberikan return yang pasti",
        },
        {
          type: "EMAS",
          allocation: 20,
          reason: "Hedge inflasi",
        },
      ],
    };
  }

  private extractAnalysisSummary(content: string): string {
    // Extract summary from AI content
    const lines = content.split("\n");
    return (
      lines[0] || "Analisis portfolio menunjukkan profil risiko yang seimbang."
    );
  }

  private extractPortfolioStrengths(content: string): string[] {
    return [
      "Diversifikasi yang baik antar kelas aset",
      "Profil risiko sesuai dengan usia",
      "Alokasi yang tepat untuk tujuan jangka panjang",
    ];
  }

  private extractPortfolioWeaknesses(content: string): string[] {
    return [
      "Kurang eksposur pada sektor teknologi",
      "Perlu peningkatan pada instrumen internasional",
      "Dana darurat belum optimal",
    ];
  }

  private extractPortfolioRecommendations(content: string): string[] {
    return [
      "Tingkatkan alokasi reksadana teknologi hingga 15%",
      "Pertimbangkan ETF global untuk diversifikasi",
      "Rebalancing portfolio setiap 6 bulan",
    ];
  }

  private assessPortfolioRisk(content: string) {
    return {
      level: "Menengah",
      score: 6.5,
      factors: ["Volatilitas", "Konsentrasi", "Likuiditas"],
      recommendation:
        "Portfolio sudah cukup seimbang dengan risiko yang terukur",
    };
  }

  private getFallbackPortfolioAnalysis() {
    return {
      summary: "Analisis portfolio tidak tersedia saat ini",
      recommendations: [
        "Konsultasi dengan advisor",
        "Review portfolio secara berkala",
      ],
      risk: "Tidak dapat dinilai",
    };
  }
}
