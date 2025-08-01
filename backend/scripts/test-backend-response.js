async function testAPIResponse() {
  console.log("🧪 Testing Backend API Response Structure");

  try {
    const response = await fetch(
      "http://localhost:3001/api/v1/financial/ai-insights",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
      }
    );

    console.log("📊 Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ API call failed:", errorText);
      return;
    }

    const data = await response.json();
    console.log("📋 Raw Response Data:", JSON.stringify(data, null, 2));

    // Analyze structure
    console.log("\n🔍 Structure Analysis:");
    console.log("- data.success:", data?.success);
    console.log("- data.insights:", typeof data?.insights, data?.insights);
    console.log(
      "- data.aiMetadata:",
      typeof data?.aiMetadata,
      data?.aiMetadata
    );

    // Test path access like frontend does
    console.log("\n🔍 Frontend Path Test:");
    console.log("- data?.insights?.summary:", data?.insights?.summary);
    console.log(
      "- data?.insights?.opportunities:",
      data?.insights?.opportunities
    );
    console.log(
      "- data?.insights?.financialMetrics:",
      data?.insights?.financialMetrics
    );
    console.log(
      "- data?.insights?.riskAssessment:",
      data?.insights?.riskAssessment
    );
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

testAPIResponse();
