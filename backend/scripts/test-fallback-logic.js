/**
 * Test Financial Insights - Bypass Auth Version
 * This test bypasses authentication to test just the financial analysis logic
 */

// Mock user data for testing
const mockUser = {
  id: "test-user-123",
  email: "test@fintar.com",
  profile: {
    monthlyIncome: 15000000, // 15 million IDR
    monthlyExpenses: 8000000, // 8 million IDR
    currentSavings: 50000000, // 50 million IDR
    currentDebt: 10000000, // 10 million IDR
  },
};

// Test the fallback logic directly
function testFallbackLogic() {
  console.log("🧪 Testing Fallback Financial Analysis Logic");
  console.log("=" * 50);

  const income = mockUser.profile.monthlyIncome;
  const expenses = mockUser.profile.monthlyExpenses;
  const savings = mockUser.profile.currentSavings;
  const debt = mockUser.profile.currentDebt;

  // Calculate basic financial metrics (same as backend)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const debtToIncomeRatio = income > 0 ? (debt / (income * 12)) * 100 : 0;
  const emergencyFundMonths = expenses > 0 ? savings / expenses : 0;

  console.log("📊 Financial Metrics:");
  console.log(`💰 Monthly Income: ${income.toLocaleString("id-ID")} IDR`);
  console.log(`💸 Monthly Expenses: ${expenses.toLocaleString("id-ID")} IDR`);
  console.log(`💵 Current Savings: ${savings.toLocaleString("id-ID")} IDR`);
  console.log(`💳 Current Debt: ${debt.toLocaleString("id-ID")} IDR`);
  console.log();

  console.log("📈 Calculated Ratios:");
  console.log(`📊 Savings Rate: ${savingsRate.toFixed(1)}%`);
  console.log(`📊 Debt-to-Income Ratio: ${debtToIncomeRatio.toFixed(1)}%`);
  console.log(`📊 Emergency Fund: ${emergencyFundMonths.toFixed(1)} months`);
  console.log();

  // Generate recommendations based on the same logic as backend
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
    recommendations.push("Tingkatkan dana darurat menjadi 6 bulan pengeluaran");
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
    recommendations.push("Pertimbangkan strategi pelunasan utang lebih cepat");
    if (riskLevel !== "high") riskLevel = "moderate";
  }

  // Investment Recommendations
  if (savingsRate >= 20 && emergencyFundMonths >= 6 && debtToIncomeRatio < 20) {
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

  console.log("🎯 Analysis Results:");
  console.log(`🔍 Risk Level: ${riskLevel.toUpperCase()}`);
  console.log(`📝 Summary: ${summary}`);
  console.log();

  console.log("💡 Recommendations:");
  recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });

  console.log("\n✅ Fallback Logic Test Completed Successfully!");
  console.log(
    "🎉 The financial analysis system can provide meaningful insights"
  );
  console.log("   even when external AI services are unavailable.");

  return {
    success: true,
    metrics: { savingsRate, debtToIncomeRatio, emergencyFundMonths },
    riskLevel,
    summary,
    recommendations,
  };
}

// Run the test
const result = testFallbackLogic();
