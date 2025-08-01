/**
 * Browser Test for Financial Analysis
 * Copy and paste this in browser console on http://localhost:3000/financial-analysis
 */

async function testFinancialAnalysisBrowser() {
  console.log("🧪 Testing Financial Analysis in Browser");

  try {
    // Check if we can access the component
    const analysisButton = document.querySelector('button[class*="bg-blue"]');
    if (!analysisButton) {
      console.log(
        "❌ Analysis button not found. Make sure you're on the financial analysis page."
      );
      return;
    }

    console.log("✅ Found analysis button");

    // Test direct API call
    console.log("📡 Testing direct API call...");
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("❌ No access token found. Please login first.");
      return;
    }

    const response = await fetch("/api/v1/financial/ai-insights", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Raw API Response:", data);

      // Test structure
      console.log("🔍 Testing structure:");
      console.log("- data.success:", data?.success);
      console.log("- data.insights:", data?.insights);
      console.log("- data.aiMetadata:", data?.aiMetadata);
      console.log("- insights.summary:", data?.insights?.summary);
      console.log("- insights.opportunities:", data?.insights?.opportunities);
      console.log(
        "- insights.financialMetrics:",
        data?.insights?.financialMetrics
      );
      console.log("- insights.riskAssessment:", data?.insights?.riskAssessment);

      console.log(
        "🎉 API test successful! Now click the analysis button to test the full flow."
      );
    } else {
      const errorText = await response.text();
      console.log("❌ API call failed:", errorText);
    }
  } catch (error) {
    console.log("❌ Error:", error);
  }
}

console.log("📋 Browser test loaded. Run: testFinancialAnalysisBrowser()");
