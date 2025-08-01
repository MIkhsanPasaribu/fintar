/**
 * Frontend Data Structure Test
 * Simulates the frontend processing and displays expected structure
 */

// Mock the API response structure from backend
const mockBackendResponse = {
  success: true,
  insights: {
    summary:
      "Kondisi keuangan Anda dalam kondisi baik. Saatnya mempertimbangkan strategi investasi untuk pertumbuhan kekayaan jangka panjang.",
    opportunities: [
      "Tingkat menabung Anda sudah baik, pertimbangkan investasi",
      "Kondisi keuangan baik, saatnya mulai berinvestasi",
      "Pertimbangkan reksadana atau instrumen investasi jangka panjang",
    ],
    riskAssessment: {
      level: "low",
      factors: ["emergency fund", "savings rate", "debt ratio"],
      recommendations: [
        "Tingkat menabung Anda sudah baik, pertimbangkan investasi",
        "Kondisi keuangan baik, saatnya mulai berinvestasi",
        "Pertimbangkan reksadana atau instrumen investasi jangka panjang",
      ],
    },
    financialMetrics: {
      savingsRate: "46.7",
      debtToIncomeRatio: "5.6",
      emergencyFundMonths: "6.3",
    },
  },
  aiMetadata: {
    model: "fallback-rules-based",
    tokens: 0,
    confidence: 0.7,
    source: "built-in-financial-rules",
  },
};

// Simulate the current frontend AI API processing
function simulateCurrentAIAPI(backendResponse) {
  console.log("🔍 Backend Response:", backendResponse);

  const responseData = backendResponse;
  const insights = responseData?.insights || {};

  const frontendResult = {
    success: true,
    insights: insights.summary || "Analisis keuangan berhasil diproses",
    data: responseData, // Keep original structure in data
    metadata: responseData?.aiMetadata || {},
  };

  console.log("📊 Frontend Processed Result:", frontendResult);
  return frontendResult;
}

// Simulate the frontend component display logic
function simulateComponentDisplay(analysisData) {
  console.log("\n🎭 Simulating Frontend Component Display:");

  // Helper function (same as in component)
  const getInsightsData = (analysis) => {
    return (
      analysis?.data?.insights || // Backend response wrapped in data
      analysis?.insights || // Direct insights
      {}
    );
  };

  const getMetadata = (analysis) => {
    return analysis?.metadata || analysis?.data?.aiMetadata || {};
  };

  const insights = getInsightsData(analysisData);
  const metadata = getMetadata(analysisData);

  console.log("📋 Extracted Insights:", insights);
  console.log("📋 Extracted Metadata:", metadata);

  // Test display paths
  console.log("\n🔍 Display Test Results:");
  console.log(
    "✅ Summary:",
    insights?.summary || analysisData.insights || "No summary"
  );
  console.log(
    "✅ Opportunities:",
    insights?.opportunities || "No opportunities"
  );
  console.log(
    "✅ Financial Metrics:",
    insights?.financialMetrics || "No metrics"
  );
  console.log(
    "✅ Risk Assessment:",
    insights?.riskAssessment || "No risk assessment"
  );
  console.log("✅ AI Source:", metadata?.source || "No source");

  return {
    summary: insights?.summary || analysisData.insights || "No summary",
    hasMetrics: !!insights?.financialMetrics,
    hasOpportunities: !!insights?.opportunities?.length,
    hasRiskAssessment: !!insights?.riskAssessment,
    aiSource: metadata?.source,
  };
}

console.log("🧪 Testing Frontend Financial Analysis Data Flow\n");

// Run the simulation
const frontendProcessed = simulateCurrentAIAPI(mockBackendResponse);
const displayResult = simulateComponentDisplay(frontendProcessed);

console.log("\n🎯 Final Display Result:", displayResult);

if (
  displayResult.summary !== "No summary" &&
  displayResult.hasMetrics &&
  displayResult.hasOpportunities &&
  displayResult.hasRiskAssessment
) {
  console.log("\n✅ SUCCESS: All data should display correctly in frontend!");
} else {
  console.log("\n❌ ISSUE: Some data missing in frontend display");
  console.log("Missing:", {
    summary: displayResult.summary === "No summary",
    metrics: !displayResult.hasMetrics,
    opportunities: !displayResult.hasOpportunities,
    riskAssessment: !displayResult.hasRiskAssessment,
  });
}
