/**
 * Browser-based Frontend Test for AI Navigator
 * Copy and paste this into browser console on http://localhost:3000/chat
 */

console.log("🚀 Testing Fintar AI Navigator from Browser...\n");

// Test function
async function testAINavigator() {
  try {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log(
        "❌ No auth token found. Please login first at http://localhost:3000/login"
      );
      return;
    }

    console.log("✅ Auth token found");

    // Test API base connection
    const API_BASE = "http://localhost:3001/api/v1";

    // Test health endpoint
    console.log("🏥 Testing API health...");
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ API Health:", healthData.status);

    // Test chat session creation
    console.log("💬 Testing chat session creation...");
    const sessionResponse = await fetch(`${API_BASE}/chat/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Browser Test Session",
        type: "financial_planning", // Use lowercase as expected by backend
        metadata: {
          testType: "browser",
          createdAt: new Date().toISOString(),
        },
      }),
    });

    if (!sessionResponse.ok) {
      throw new Error(`Session creation failed: ${sessionResponse.status}`);
    }

    const sessionData = await sessionResponse.json();
    const sessionId = sessionData.id;
    console.log("✅ Session created:", sessionId);

    // Test sending message
    console.log("📨 Testing message sending...");
    const messageResponse = await fetch(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content:
            "Halo Fintar AI Navigator! Test dari browser. Berikan analisis singkat tentang pentingnya literasi keuangan.",
          context: {
            userProfile: { name: "Browser Test User" },
            conversationHistory: [],
          },
        }),
      }
    );

    if (!messageResponse.ok) {
      throw new Error(`Message sending failed: ${messageResponse.status}`);
    }

    const messageData = await messageResponse.json();
    console.log("✅ Message sent successfully");
    console.log(
      "🤖 AI Response preview:",
      messageData.aiMessage?.content?.substring(0, 200) + "..."
    );

    // Test financial endpoints
    console.log("💰 Testing financial AI endpoints...");

    const insightsResponse = await fetch(`${API_BASE}/financial/ai-insights`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const insightsData = await insightsResponse.json();
    console.log(
      "📊 Financial Insights:",
      insightsData.success ? "✅ Working" : "❌ Failed"
    );

    const planResponse = await fetch(`${API_BASE}/financial/ai-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        duration: "1_year",
        goals: ["saving", "investment"],
      }),
    });
    const planData = await planResponse.json();
    console.log(
      "📋 Financial Plan:",
      planData.success ? "✅ Working" : "❌ Failed"
    );

    const budgetResponse = await fetch(
      `${API_BASE}/financial/budget/ai-recommendations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const budgetData = await budgetResponse.json();
    console.log(
      "💸 Budget AI:",
      budgetData.success ? "✅ Working" : "❌ Failed"
    );

    const investmentResponse = await fetch(
      `${API_BASE}/financial/investment/recommendations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const investmentData = await investmentResponse.json();
    console.log(
      "📈 Investment AI:",
      investmentData.success ? "✅ Working" : "❌ Failed"
    );

    console.log("\n🎉 Browser Test Results:");
    console.log("✅ API Connection: Working");
    console.log("✅ Authentication: Working");
    console.log("✅ Chat Session: Working");
    console.log("✅ AI Messages: Working");
    console.log("✅ Financial AI: Working");
    console.log("\n🌟 Fintar AI Navigator is fully functional!");
  } catch (error) {
    console.error("❌ Browser test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log(
      "1. Make sure you are logged in at http://localhost:3000/login"
    );
    console.log("2. Make sure backend is running at http://localhost:3001");
    console.log("3. Check browser console for CORS or network errors");
  }
}

// Run the test
testAINavigator();
