/**
 * Test Frontend API Integration
 * Run this in browser console on http://localhost:3000/financial-analysis
 */

// This should be run in browser console after logging in
async function testFrontendAPI() {
  console.log("🧪 Testing Frontend API Integration");

  try {
    // Test the APIClient directly
    const response = await fetch("/api/v1/financial/ai-insights", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.getItem("accessToken") || "your-token-here"
        }`,
      },
    });

    console.log("📊 Response Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("📋 Raw Response Data:", data);

      // Test the structure expected by frontend
      console.log("🔍 Testing Frontend Structure:");
      console.log("- insights.summary:", data?.insights?.summary);
      console.log("- insights.opportunities:", data?.insights?.opportunities);
      console.log(
        "- insights.financialMetrics:",
        data?.insights?.financialMetrics
      );
      console.log("- aiMetadata:", data?.aiMetadata);
    } else {
      console.log("❌ API call failed:", await response.text());
    }
  } catch (error) {
    console.log("❌ Error:", error);
  }
}

// To run: Copy this to browser console and call testFrontendAPI()
console.log("📋 Test function loaded. Run: testFrontendAPI()");
