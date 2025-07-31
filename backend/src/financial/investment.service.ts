import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { GeminiService } from "../common/ai/gemini.service";
import { InvestmentPlanDto } from "./dto/investment-plan.dto";

@Injectable()
export class InvestmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService
  ) {}

  async getInvestmentRecommendations(userId: string) {
    // Get user profile for financial information
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return {
        error:
          "No financial data found. Please complete your financial profile first.",
        recommendations: [],
      };
    }

    const monthlyIncome = Number(userProfile.monthlyIncome) || 0;
    const monthlyExpenses = Number(userProfile.monthlyExpenses) || 0;
    const currentSavings = Number(userProfile.currentSavings) || 0;
    const riskTolerance = userProfile.riskTolerance || "MODERATE";
    const investmentExperience = userProfile.investmentExperience || "Pemula";

    const availableForInvestment = monthlyIncome - monthlyExpenses;
    const emergencyFundNeeded = monthlyExpenses * 6; // 6 months emergency fund
    const emergencyFundCurrent = Number(userProfile.emergencyFundAmount) || 0;

    // Base recommendations based on risk tolerance
    const recommendations = this.getBaseInvestmentRecommendations(
      riskTolerance as any,
      investmentExperience,
      availableForInvestment,
      currentSavings
    );

    return {
      profile: {
        monthlyIncome,
        monthlyExpenses,
        availableForInvestment,
        currentSavings,
        riskTolerance,
        investmentExperience,
        emergencyFundStatus: {
          needed: emergencyFundNeeded,
          current: emergencyFundCurrent,
          deficit: Math.max(0, emergencyFundNeeded - emergencyFundCurrent),
        },
      },
      recommendations,
      nextSteps: this.getInvestmentNextSteps(
        emergencyFundCurrent,
        emergencyFundNeeded,
        availableForInvestment,
        riskTolerance as any
      ),
    };
  }

  private getBaseInvestmentRecommendations(
    riskTolerance: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE",
    experience: string,
    availableAmount: number,
    currentSavings: number
  ) {
    const recommendations: any[] = [];

    switch (riskTolerance) {
      case "CONSERVATIVE":
        recommendations.push(
          {
            type: "DEPOSITO",
            allocation: 40,
            description: "Deposito bank dengan bunga tetap untuk stabilitas",
            expectedReturn: "4-6%",
            risk: "Rendah",
            minimumAmount: 1000000,
          },
          {
            type: "REKSADANA",
            subtype: "Pasar Uang",
            allocation: 35,
            description: "Reksadana pasar uang untuk likuiditas tinggi",
            expectedReturn: "3-5%",
            risk: "Rendah",
            minimumAmount: 100000,
          },
          {
            type: "OBLIGASI",
            allocation: 25,
            description:
              "Obligasi pemerintah (SUN/Sukuk) untuk pendapatan tetap",
            expectedReturn: "5-7%",
            risk: "Rendah-Menengah",
            minimumAmount: 1000000,
          }
        );
        break;

      case "MODERATE":
        recommendations.push(
          {
            type: "REKSADANA",
            subtype: "Campuran",
            allocation: 40,
            description:
              "Reksadana campuran untuk keseimbangan pertumbuhan dan stabilitas",
            expectedReturn: "6-10%",
            risk: "Menengah",
            minimumAmount: 100000,
          },
          {
            type: "SAHAM",
            subtype: "Blue Chip",
            allocation: 30,
            description: "Saham perusahaan besar dan stabil (BBCA, ASII, TLKM)",
            expectedReturn: "8-15%",
            risk: "Menengah",
            minimumAmount: 500000,
          },
          {
            type: "DEPOSITO",
            allocation: 20,
            description: "Deposito untuk stabilitas portofolio",
            expectedReturn: "4-6%",
            risk: "Rendah",
            minimumAmount: 1000000,
          },
          {
            type: "EMAS",
            allocation: 10,
            description: "Emas sebagai hedge inflasi",
            expectedReturn: "5-8%",
            risk: "Menengah",
            minimumAmount: 500000,
          }
        );
        break;

      case "AGGRESSIVE":
        recommendations.push(
          {
            type: "SAHAM",
            subtype: "Growth Stocks",
            allocation: 50,
            description: "Saham pertumbuhan dengan potensi return tinggi",
            expectedReturn: "10-25%",
            risk: "Tinggi",
            minimumAmount: 500000,
          },
          {
            type: "REKSADANA",
            subtype: "Saham",
            allocation: 25,
            description: "Reksadana saham untuk diversifikasi",
            expectedReturn: "8-18%",
            risk: "Tinggi",
            minimumAmount: 100000,
          },
          {
            type: "CRYPTOCURRENCY",
            allocation: 15,
            description:
              "Cryptocurrency (Bitcoin, Ethereum) - hanya untuk yang berpengalaman",
            expectedReturn: "15-50%",
            risk: "Sangat Tinggi",
            minimumAmount: 100000,
          },
          {
            type: "P2P_LENDING",
            allocation: 10,
            description: "Peer-to-peer lending untuk yield tinggi",
            expectedReturn: "12-20%",
            risk: "Tinggi",
            minimumAmount: 100000,
          }
        );
        break;
    }

    return recommendations;
  }

  private getInvestmentNextSteps(
    emergencyFundCurrent: number,
    emergencyFundNeeded: number,
    availableAmount: number,
    riskTolerance: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE"
  ): string[] {
    const steps: string[] = [];

    // Emergency fund first
    if (emergencyFundCurrent < emergencyFundNeeded) {
      steps.push(
        `Prioritaskan membangun dana darurat sebesar Rp ${emergencyFundNeeded.toLocaleString("id-ID")}`
      );
    }

    // Investment amount check
    if (availableAmount < 100000) {
      steps.push(
        "Tingkatkan penghasilan atau kurangi pengeluaran untuk mulai berinvestasi"
      );
    } else {
      steps.push(
        "Mulai dengan reksadana pasar uang atau deposito untuk membangun kebiasaan"
      );

      if (availableAmount >= 500000) {
        steps.push(
          "Pertimbangkan diversifikasi ke saham blue chip atau reksadana campuran"
        );
      }

      if (availableAmount >= 1000000 && riskTolerance !== "CONSERVATIVE") {
        steps.push(
          "Alokasikan sebagian ke instrumen dengan return lebih tinggi"
        );
      }
    }

    steps.push("Lakukan review dan rebalancing portofolio setiap 6 bulan");
    steps.push("Pelajari terus tentang investasi dan pasar finansial");

    return steps;
  }

  async createInvestmentPlan(userId: string, planDto: InvestmentPlanDto) {
    const { totalAmount, riskTolerance, durationMonths, allocation } = planDto;

    // Calculate expected returns based on allocation
    const projectedReturns = this.calculateProjectedReturns(
      allocation,
      totalAmount,
      durationMonths
    );

    // Store investment plan for tracking
    const plan = {
      userId,
      totalAmount,
      riskTolerance,
      durationMonths,
      allocation,
      projectedReturns,
      createdAt: new Date(),
    };

    // In a real implementation, this would be stored in the database
    // For now, we'll return the calculated plan

    return {
      plan,
      recommendations: this.getPersonalizedRecommendations(planDto),
      timeline: this.createInvestmentTimeline(totalAmount, durationMonths),
    };
  }

  private calculateProjectedReturns(
    allocation: any,
    totalAmount: number,
    durationMonths: number
  ) {
    if (!allocation) return { total: totalAmount, growth: 0 };

    // Approximate annual returns by investment type
    const returnRates: any = {
      SAHAM: 0.12,
      REKSADANA: 0.08,
      OBLIGASI: 0.06,
      DEPOSITO: 0.05,
      EMAS: 0.06,
      PROPERTI: 0.1,
      CRYPTOCURRENCY: 0.2, // Very volatile
      P2P_LENDING: 0.15,
    };

    let weightedReturn = 0;
    let totalPercentage = 0;

    Object.entries(allocation).forEach(([type, percentage]: [string, any]) => {
      const rate = returnRates[type] || 0.05;
      weightedReturn += (percentage / 100) * rate;
      totalPercentage += percentage;
    });

    // Normalize if total percentage != 100
    if (totalPercentage !== 100 && totalPercentage > 0) {
      weightedReturn = (weightedReturn / totalPercentage) * 100;
    }

    const years = durationMonths / 12;
    const finalAmount = totalAmount * Math.pow(1 + weightedReturn, years);
    const totalGrowth = finalAmount - totalAmount;

    return {
      initial: totalAmount,
      final: Math.round(finalAmount),
      growth: Math.round(totalGrowth),
      annualReturn: Math.round(weightedReturn * 10000) / 100, // Percentage with 2 decimals
    };
  }

  private getPersonalizedRecommendations(planDto: InvestmentPlanDto): string[] {
    const { totalAmount, riskTolerance, durationMonths } = planDto;
    const recommendations: string[] = [];

    if (totalAmount < 1000000) {
      recommendations.push(
        "Mulai dengan reksadana untuk diversifikasi instan dengan modal kecil"
      );
    }

    if (durationMonths >= 60) {
      // 5+ years
      recommendations.push(
        "Dengan horizon investasi panjang, pertimbangkan alokasi saham yang lebih besar"
      );
    } else if (durationMonths <= 12) {
      // 1 year or less
      recommendations.push(
        "Untuk investasi jangka pendek, fokus pada instrumen likuid seperti deposito atau reksadana pasar uang"
      );
    }

    if (riskTolerance === "AGGRESSIVE") {
      recommendations.push(
        "Sebagai investor agresif, pertimbangkan saham growth dan emerging markets"
      );
    } else if (riskTolerance === "CONSERVATIVE") {
      recommendations.push(
        "Fokus pada instrumen fixed income seperti obligasi dan deposito"
      );
    }

    return recommendations;
  }

  private createInvestmentTimeline(
    totalAmount: number,
    durationMonths: number
  ) {
    const monthlyAmount = totalAmount / durationMonths;
    const timeline: any[] = [];

    for (let month = 1; month <= Math.min(durationMonths, 12); month++) {
      timeline.push({
        month,
        action: `Investasi Rp ${monthlyAmount.toLocaleString("id-ID")}`,
        cumulativeAmount: monthlyAmount * month,
        milestone: month % 3 === 0 ? "Review dan rebalancing portofolio" : null,
      });
    }

    return timeline;
  }
}
