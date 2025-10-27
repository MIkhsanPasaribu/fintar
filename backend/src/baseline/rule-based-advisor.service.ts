import { Injectable, Logger } from "@nestjs/common";

/**
 * Rule-Based Financial Advisor (Baseline System)
 *
 * This is a simple rule-based system for comparative analysis.
 * Used as baseline to demonstrate improvement of AI-powered system.
 *
 * Rules are based on common financial advice principles:
 * - Emergency fund: 3-6 months expenses
 * - Debt-to-income ratio: < 30%
 * - Savings rate: 10-20% of income
 * - Investment allocation based on age and risk tolerance
 */
@Injectable()
export class RuleBasedAdvisorService {
  private readonly logger = new Logger(RuleBasedAdvisorService.name);

  /**
   * Get budget advice based on simple rules
   */
  getBudgetAdvice(income: number, expenses: number): string {
    const savingsRate = ((income - expenses) / income) * 100;

    if (savingsRate < 0) {
      return "Pengeluaran Anda melebihi pendapatan. Prioritas utama adalah mengurangi pengeluaran tidak penting seperti hiburan dan makan di luar. Buat daftar pengeluaran wajib (sewa, makanan, transportasi) dan sisihkan yang tidak perlu.";
    } else if (savingsRate < 10) {
      return "Tingkat tabungan Anda kurang dari 10%. Disarankan untuk menabung minimal 10-20% dari pendapatan. Coba identifikasi pengeluaran yang bisa dikurangi dan alihkan ke tabungan.";
    } else if (savingsRate < 20) {
      return "Tingkat tabungan Anda sudah cukup baik (10-20%). Pertahankan kebiasaan ini dan pertimbangkan untuk meningkatkan tabungan jika memungkinkan.";
    } else {
      return "Tingkat tabungan Anda sangat baik (>20%). Anda sudah memiliki disiplin keuangan yang kuat. Pertimbangkan untuk mengalokasikan sebagian tabungan ke investasi.";
    }
  }

  /**
   * Get investment advice based on simple rules
   */
  getInvestmentAdvice(
    age: number,
    monthlyIncome: number,
    riskTolerance: "low" | "moderate" | "high"
  ): string {
    const hasEmergencyFund = monthlyIncome * 3; // Assume 3 months minimum

    if (monthlyIncome < 3000000) {
      return "Dengan pendapatan saat ini, prioritas utama adalah membangun dana darurat minimal 3 bulan pengeluaran. Setelah itu, mulai dengan investasi rendah risiko seperti deposito atau reksa dana pasar uang.";
    }

    if (age < 30) {
      if (riskTolerance === "high") {
        return "Usia Anda masih muda dan toleransi risiko tinggi. Anda bisa mengalokasikan 70% saham, 20% reksa dana campuran, dan 10% emas. Diversifikasi untuk mengurangi risiko.";
      } else if (riskTolerance === "moderate") {
        return "Dengan usia dan profil risiko moderat, alokasi yang seimbang adalah 50% saham, 30% obligasi, dan 20% reksa dana pasar uang.";
      } else {
        return "Untuk profil risiko rendah, alokasi aman adalah 30% saham blue chip, 50% obligasi, dan 20% deposito.";
      }
    } else if (age < 50) {
      if (riskTolerance === "high") {
        return "Di usia ini, alokasi moderat-agresif disarankan: 60% saham, 25% obligasi, 15% emas/properti.";
      } else if (riskTolerance === "moderate") {
        return "Alokasi seimbang untuk usia Anda: 40% saham, 40% obligasi, 20% reksa dana pasar uang.";
      } else {
        return "Untuk profil konservatif, fokus pada instrumen stabil: 20% saham defensive, 60% obligasi, 20% deposito.";
      }
    } else {
      return "Mendekati masa pensiun, prioritas adalah menjaga modal. Alokasi konservatif: 20% saham, 50% obligasi, 30% deposito/reksa dana pendapatan tetap.";
    }
  }

  /**
   * Get emergency fund advice
   */
  getEmergencyFundAdvice(
    monthlyExpenses: number,
    currentSavings: number
  ): string {
    const requiredMin = monthlyExpenses * 3;
    const requiredIdeal = monthlyExpenses * 6;

    if (currentSavings < requiredMin) {
      const shortfall = requiredMin - currentSavings;
      return `Dana darurat Anda kurang dari 3 bulan pengeluaran. Anda perlu tambahan Rp ${shortfall.toLocaleString("id-ID")} untuk mencapai minimum. Prioritaskan untuk menyisihkan 10-20% pendapatan setiap bulan ke dana darurat.`;
    } else if (currentSavings < requiredIdeal) {
      const shortfall = requiredIdeal - currentSavings;
      return `Dana darurat Anda sudah mencapai minimum 3 bulan. Untuk lebih aman, targetkan 6 bulan pengeluaran. Anda perlu tambahan Rp ${shortfall.toLocaleString("id-ID")}.`;
    } else {
      return `Dana darurat Anda sudah memadai (6+ bulan pengeluaran). Anda bisa fokus pada investasi jangka panjang sambil tetap menjaga dana darurat ini.`;
    }
  }

  /**
   * Get debt management advice
   */
  getDebtAdvice(totalDebt: number, monthlyIncome: number): string {
    const debtToIncomeRatio = (totalDebt / (monthlyIncome * 12)) * 100;

    if (debtToIncomeRatio > 50) {
      return "Rasio utang Anda sangat tinggi (>50% dari pendapatan tahunan). Ini zona bahaya. Prioritas utama adalah melunasi utang dengan bunga tertinggi terlebih dahulu (metode avalanche). Hindari utang baru dan kurangi pengeluaran drastis.";
    } else if (debtToIncomeRatio > 30) {
      return "Rasio utang Anda cukup tinggi (30-50%). Buat rencana pelunasan dengan metode snowball (utang terkecil dulu) atau avalanche (bunga tertinggi dulu). Sisihkan minimal 20% pendapatan untuk cicilan utang.";
    } else if (debtToIncomeRatio > 0) {
      return "Rasio utang Anda masih terkendali (<30%). Terus lunasi utang secara konsisten sambil tetap menabung untuk dana darurat.";
    } else {
      return "Anda tidak memiliki utang. Ini posisi yang sangat baik. Fokus pada membangun tabungan dan investasi untuk masa depan.";
    }
  }

  /**
   * Get savings goal advice
   */
  getSavingsGoalAdvice(
    goalAmount: number,
    timeframeMonths: number,
    currentSavings: number
  ): string {
    const remaining = goalAmount - currentSavings;
    const monthlyTarget = remaining / timeframeMonths;

    if (monthlyTarget <= 0) {
      return `Selamat! Anda sudah mencapai target tabungan Rp ${goalAmount.toLocaleString("id-ID")}. Pertimbangkan untuk menetapkan tujuan keuangan baru.`;
    }

    return `Untuk mencapai target Rp ${goalAmount.toLocaleString("id-ID")} dalam ${timeframeMonths} bulan, Anda perlu menyisihkan Rp ${Math.ceil(monthlyTarget).toLocaleString("id-ID")} per bulan. ${
      monthlyTarget > 1000000
        ? "Target ini cukup tinggi. Pertimbangkan untuk memperpanjang jangka waktu atau mengurangi target jika terlalu sulit."
        : "Target ini terlihat realistis. Buat autodebet bulanan agar lebih disiplin."
    }`;
  }

  /**
   * Get financial planning advice
   */
  getFinancialPlanningAdvice(
    age: number,
    monthlyIncome: number,
    monthlyExpenses: number,
    hasEmergencyFund: boolean,
    hasInsurance: boolean
  ): string {
    let advice = "Rencana keuangan Anda:\n\n";

    // Priority 1: Emergency Fund
    if (!hasEmergencyFund) {
      advice +=
        "1. PRIORITAS UTAMA: Bangun dana darurat 3-6 bulan pengeluaran. Ini adalah fondasi keuangan yang stabil.\n\n";
    } else {
      advice += "1. ✓ Dana darurat sudah terpenuhi.\n\n";
    }

    // Priority 2: Insurance
    if (!hasInsurance) {
      advice +=
        "2. ASURANSI: Lindungi diri dengan asuransi kesehatan minimal. Jika punya tanggungan, pertimbangkan asuransi jiwa.\n\n";
    } else {
      advice += "2. ✓ Asuransi sudah ada.\n\n";
    }

    // Priority 3: Retirement
    const yearsToRetirement = 60 - age;
    if (yearsToRetirement > 10) {
      advice += `3. PENSIUN: Anda punya ${yearsToRetirement} tahun sampai pensiun. Mulai investasi untuk pensiun dengan menyisihkan 10-15% pendapatan.\n\n`;
    } else {
      advice += `3. PENSIUN: Pensiun sudah dekat (${yearsToRetirement} tahun). Tingkatkan kontribusi pensiun dan kurangi risiko investasi.\n\n`;
    }

    // Priority 4: Wealth Building
    const savingsRate =
      ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    if (savingsRate > 20) {
      advice +=
        "4. INVESTASI: Dengan tingkat tabungan yang baik, diversifikasi investasi ke saham, obligasi, dan reksa dana sesuai profil risiko.\n\n";
    } else {
      advice +=
        "4. TINGKATKAN TABUNGAN: Targetkan untuk menabung minimal 20% pendapatan sebelum berinvestasi agresif.";
    }

    return advice;
  }

  /**
   * Generic advice based on question keywords (fallback)
   */
  getGenericAdvice(question: string): string {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("budget") ||
      lowerQuestion.includes("anggaran") ||
      lowerQuestion.includes("pengeluaran")
    ) {
      return "Untuk membuat budget yang baik: 1) Catat semua pendapatan, 2) List semua pengeluaran rutin, 3) Kategorikan (kebutuhan vs keinginan), 4) Gunakan aturan 50/30/20 (50% kebutuhan, 30% keinginan, 20% tabungan/investasi), 5) Review setiap bulan.";
    } else if (
      lowerQuestion.includes("investasi") ||
      lowerQuestion.includes("invest") ||
      lowerQuestion.includes("saham")
    ) {
      return "Sebelum investasi: 1) Pastikan punya dana darurat 6 bulan, 2) Pahami profil risiko Anda, 3) Pelajari instrumen investasi (saham, obligasi, reksa dana), 4) Diversifikasi untuk kurangi risiko, 5) Investasi jangka panjang lebih baik dari spekulasi jangka pendek.";
    } else if (
      lowerQuestion.includes("utang") ||
      lowerQuestion.includes("hutang") ||
      lowerQuestion.includes("pinjaman")
    ) {
      return "Mengelola utang: 1) Prioritaskan utang dengan bunga tertinggi, 2) Bayar lebih dari minimum payment, 3) Hindari utang baru, 4) Negosiasi restrukturisasi jika perlu, 5) Gunakan metode snowball atau avalanche untuk pelunasan sistematis.";
    } else if (
      lowerQuestion.includes("tabungan") ||
      lowerQuestion.includes("menabung") ||
      lowerQuestion.includes("saving")
    ) {
      return "Tips menabung efektif: 1) Bayar diri sendiri dulu (autodebet ke tabungan), 2) Target minimal 10-20% pendapatan, 3) Pisahkan rekening untuk tujuan berbeda, 4) Kurangi pengeluaran impulsif, 5) Cari tambahan penghasilan jika perlu.";
    } else {
      return "Untuk saran keuangan yang lebih spesifik, mohon berikan detail situasi keuangan Anda seperti pendapatan, pengeluaran, usia, dan tujuan keuangan.";
    }
  }
}
