/**
 * Test Financial AI Insights Endpoint
 * Run this script to test the financial analysis endpoint
 */

const API_BASE_URL = "http://localhost:3001";

async function testFinancialInsights() {
  console.log("🧪 Testing Financial AI Insights Endpoint");

  // 1. Login first
  console.log("\n🔐 Logging in...");
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@fintar.com",
        password: "testpassword123",
      }),
    });

    if (!loginResponse.ok) {
      console.log("❌ Login failed:", loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    const authToken = loginData.accessToken;
    const userId = loginData.user.id;

    console.log("✅ Login successful");
    console.log("🆔 User ID:", userId);

    // 2. Test financial insights endpoint
    console.log("\n💰 Testing AI Financial Insights...");

    const insightsResponse = await fetch(
      `${API_BASE_URL}/api/v1/financial/ai-insights`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("📊 Response status:", insightsResponse.status);
    console.log(
      "📋 Response headers:",
      Object.fromEntries(insightsResponse.headers.entries())
    );

    if (insightsResponse.ok) {
      const insightsData = await insightsResponse.json();
      console.log("✅ Financial insights retrieved successfully!");
      console.log("📊 Response data:", insightsData);
    } else {
      const errorText = await insightsResponse.text();
      console.log("❌ Financial insights failed");
      console.log("🔍 Error response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        console.log("📋 Parsed error:", errorJson);
      } catch (e) {
        console.log("📋 Raw error text:", errorText);
      }
    }
  } catch (error) {
    console.log("❌ Test failed:", error.message);
    console.log("🔍 Full error:", error);
  }
}

testFinancialInsights();
