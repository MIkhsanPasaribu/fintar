const axios = require("axios");

// Mock data untuk testing fitur Investment AI
const mockUserProfile = {
  age: 28,
  monthlyIncome: 15000000, // 15 juta IDR
  monthlyExpenses: 8000000, // 8 juta IDR
  currentSavings: 50000000, // 50 juta IDR
  riskTolerance: "MODERATE",
  financialGoals: ["Emergency Fund", "House Down Payment", "Retirement"],
  investmentExperience: "Menengah",
};

const mockPortfolioData = {
  holdings: [
    { symbol: "BBRI", amount: 15000000, type: "stock", percentage: 30 },
    { symbol: "BMRI", amount: 10000000, type: "stock", percentage: 20 },
    { symbol: "TLKM", amount: 8000000, type: "stock", percentage: 16 },
    { symbol: "UNVR", amount: 7000000, type: "stock", percentage: 14 },
    { symbol: "ASII", amount: 10000000, type: "stock", percentage: 20 },
  ],
  totalValue: 50000000,
};

async function demonstrateInvestmentAIFeatures() {
  console.log("🚀 Demonstrasi Fitur Investment AI - Fintar");
  console.log("============================================\n");

  console.log("👤 Mock User Profile:");
  console.log(`   Usia: ${mockUserProfile.age} tahun`);
  console.log(
    `   Pendapatan: Rp ${mockUserProfile.monthlyIncome.toLocaleString("id-ID")}/bulan`
  );
  console.log(
    `   Pengeluaran: Rp ${mockUserProfile.monthlyExpenses.toLocaleString("id-ID")}/bulan`
  );
  console.log(
    `   Tabungan: Rp ${mockUserProfile.currentSavings.toLocaleString("id-ID")}`
  );
  console.log(`   Toleransi Risiko: ${mockUserProfile.riskTolerance}`);
  console.log(
    `   Pengalaman Investasi: ${mockUserProfile.investmentExperience}`
  );
  console.log(
    `   Tujuan Keuangan: ${mockUserProfile.financialGoals.join(", ")}\n`
  );

  console.log("📊 Mock Portfolio Data:");
  console.log(
    `   Total Nilai Portfolio: Rp ${mockPortfolioData.totalValue.toLocaleString("id-ID")}`
  );
  console.log("   Holdings:");
  mockPortfolioData.holdings.forEach((holding) => {
    console.log(
      `     - ${holding.symbol}: Rp ${holding.amount.toLocaleString("id-ID")} (${holding.percentage}%)`
    );
  });
  console.log();

  // Demonstrate AI Investment Recommendations Logic
  console.log("🤖 AI Investment Recommendations (Mock Logic):");
  console.log("===============================================");

  const disposableIncome =
    mockUserProfile.monthlyIncome - mockUserProfile.monthlyExpenses;
  console.log(
    `💰 Disposable Income: Rp ${disposableIncome.toLocaleString("id-ID")}/bulan\n`
  );

  const recommendations = generateMockRecommendations(
    mockUserProfile,
    disposableIncome
  );
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.type.toUpperCase()}`);
    console.log(`   Alokasi: ${rec.allocation}%`);
    console.log(`   Jumlah: Rp ${rec.amount.toLocaleString("id-ID")}`);
    console.log(`   Risiko: ${rec.risk}`);
    console.log(`   Expected Return: ${rec.expectedReturn}`);
    console.log(`   Alasan: ${rec.reason}\n`);
  });

  // Demonstrate Portfolio Analysis Logic
  console.log("📈 Portfolio Analysis (Mock Logic):");
  console.log("===================================");

  const analysis = generateMockPortfolioAnalysis(
    mockPortfolioData,
    mockUserProfile
  );
  console.log(`Overall Score: ${analysis.score}/100`);
  console.log(`Diversification: ${analysis.diversification}`);
  console.log(`Risk Level: ${analysis.riskLevel}`);
  console.log(`Performance: ${analysis.performance}\n`);

  console.log("Recommendations:");
  analysis.suggestions.forEach((suggestion, index) => {
    console.log(`${index + 1}. ${suggestion}`);
  });
  console.log();

  // Demonstrate Market Trends Logic
  console.log("📊 Market Trends Analysis (Mock Data):");
  console.log("======================================");

  const marketTrends = generateMockMarketTrends();
  console.log(`Market Summary: ${marketTrends.summary}\n`);

  console.log("Sector Performance:");
  Object.entries(marketTrends.sectors).forEach(([sector, data]) => {
    console.log(
      `  ${sector.toUpperCase()}: ${data.trend} (${data.change}) - ${data.outlook}`
    );
  });
  console.log();

  console.log("Key Recommendations:");
  marketTrends.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
  console.log();

  console.log("🎯 Investment AI Feature Summary:");
  console.log("==================================");
  console.log("✅ AI-powered investment recommendations based on user profile");
  console.log("✅ Portfolio analysis with risk assessment and suggestions");
  console.log("✅ Real-time market trends and sector analysis");
  console.log("✅ Personalized financial planning and goal alignment");
  console.log("✅ Risk tolerance and experience level consideration");
  console.log("✅ Indonesian market focus (IHSG, local stocks, etc.)");
  console.log();

  console.log("🔗 Access Investment AI:");
  console.log("   Frontend: http://localhost:3000/investment-ai");
  console.log(
    "   Backend API: http://localhost:3001/api/v1/financial/investment/*"
  );
}

function generateMockRecommendations(profile, disposableIncome) {
  const monthlyInvestment = disposableIncome * 0.3; // 30% dari disposable income

  const recommendations = [
    {
      type: "Reksa Dana Saham",
      allocation: 40,
      amount: monthlyInvestment * 0.4,
      risk: "Sedang-Tinggi",
      expectedReturn: "10-15% per tahun",
      reason:
        "Cocok untuk usia muda dengan toleransi risiko moderate dan tujuan jangka panjang",
    },
    {
      type: "Obligasi Pemerintah",
      allocation: 30,
      amount: monthlyInvestment * 0.3,
      risk: "Rendah",
      expectedReturn: "6-8% per tahun",
      reason:
        "Memberikan stabilitas dan pendapatan tetap untuk menyeimbangkan portfolio",
    },
    {
      type: "Reksa Dana Pasar Uang",
      allocation: 20,
      amount: monthlyInvestment * 0.2,
      risk: "Sangat Rendah",
      expectedReturn: "4-6% per tahun",
      reason: "Emergency fund dan likuiditas tinggi untuk kebutuhan mendadak",
    },
    {
      type: "Saham Individual",
      allocation: 10,
      amount: monthlyInvestment * 0.1,
      risk: "Tinggi",
      expectedReturn: "12-20% per tahun",
      reason:
        "Potensi pertumbuhan tinggi untuk investor dengan pengalaman menengah",
    },
  ];

  return recommendations;
}

function generateMockPortfolioAnalysis(portfolio, profile) {
  // Simple mock analysis logic
  const analysis = {
    score: 75,
    diversification:
      "Baik - Terdiversifikasi di sektor perbankan, telekomunikasi, consumer goods, dan otomotif",
    riskLevel:
      "Moderate-High - Dominasi saham dengan risiko volatilitas tinggi",
    performance:
      "Positif - Portfolio mengikuti pergerakan IHSG dengan beta sekitar 1.1",
    suggestions: [
      "Tambahkan obligasi pemerintah untuk mengurangi volatilitas (target 20-30%)",
      "Pertimbangkan reksa dana untuk diversifikasi internasional (target 10-15%)",
      "Rebalancing setiap 6 bulan untuk mempertahankan alokasi optimal",
      "Tambahkan sektor teknologi dan healthcare untuk diversifikasi lebih baik",
    ],
  };

  return analysis;
}

function generateMockMarketTrends() {
  return {
    summary:
      "Pasar saham Indonesia menunjukkan tren positif dengan IHSG menguat 2.5% dalam sebulan terakhir. Sektor teknologi dan keuangan memimpin kenaikan.",
    sectors: {
      financial: { trend: "bullish", change: "+3.2%", outlook: "Positif" },
      technology: {
        trend: "bullish",
        change: "+5.1%",
        outlook: "Sangat Positif",
      },
      consumer: { trend: "neutral", change: "+0.8%", outlook: "Stabil" },
      energy: { trend: "bearish", change: "-1.5%", outlook: "Negatif" },
      infrastructure: { trend: "bullish", change: "+2.8%", outlook: "Positif" },
    },
    recommendations: [
      "Sektor teknologi menunjukkan momentum positif untuk investasi jangka menengah",
      "Sektor keuangan masih menarik dengan valuasi yang wajar",
      "Hindari sektor energi dalam jangka pendek karena volatilitas tinggi",
      "Diversifikasi portfolio dengan mempertimbangkan sektor infrastruktur",
      "Manfaatkan koreksi kecil untuk entry point yang lebih baik",
    ],
  };
}

// Run demonstration
demonstrateInvestmentAIFeatures().catch(console.error);
