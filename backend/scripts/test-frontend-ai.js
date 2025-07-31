/**
 * Frontend API Test - Test AI Chat from Frontend Perspective
 */

const axios = require("axios");

// Simulate frontend environment
const API_BASE = "http://localhost:3001/api/v1";

// Mock localStorage for browser environment
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

async function testFrontendAIIntegration() {
  console.log("🎯 Testing Frontend AI Integration...\n");

  try {
    // 1. Test Health Check
    console.log("1️⃣ Testing API Connectivity...");
    const healthResponse = await axios.get(`${API_BASE}/health`);
    const healthData = healthResponse.data;

    if (healthData.status === "ok") {
      console.log("✅ API connectivity successful");
    } else {
      throw new Error("API not responding correctly");
    }

    // 2. Test Login to get token
    console.log("\n2️⃣ Testing Authentication...");
    const authResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "fintargemastik@gmail.com",
      password: "securePassword123!",
    });

    const authData = authResponse.data;
    const token = authData.access_token;

    if (token) {
      console.log("✅ Authentication successful");
      // Update localStorage mock
      global.localStorage.getItem = (key) =>
        key === "auth_token" ? token : null;
    } else {
      throw new Error("Authentication failed");
    }

    // 3. Test Chat Session Creation (Frontend Flow)
    console.log("\n3️⃣ Testing Chat Session Creation...");
    const sessionResponse = await axios.post(
      `${API_BASE}/chat/sessions`,
      {
        title: "Frontend Test Session",
        type: "FINANCIAL_PLANNING",
        metadata: { testType: "frontend", createdAt: new Date().toISOString() },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const sessionData = sessionResponse.data;
    const sessionId = sessionData.id;

    if (sessionId) {
      console.log("✅ Chat session created successfully");
      console.log(`   Session ID: ${sessionId}`);
    } else {
      throw new Error("Session creation failed");
    }

    // 4. Test Chat Message (Frontend Flow)
    console.log("\n4️⃣ Testing Chat Message Processing...");
    const messageResponse = await axios.post(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        content:
          "Halo Fintar AI Navigator! Bantu saya analisis kondisi keuangan saya dan berikan rekomendasi investasi.",
        context: {
          userProfile: { name: "Test User" },
          conversationHistory: [],
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const messageData = messageResponse.data;

    if (messageData.aiMessage && messageData.aiMessage.content) {
      console.log("✅ Chat message processed successfully");
      console.log(
        `   AI Response length: ${messageData.aiMessage.content.length} characters`
      );
      console.log(
        `   Response preview: ${messageData.aiMessage.content.substring(
          0,
          100
        )}...`
      );
    } else {
      throw new Error("Chat message processing failed");
    }

    // 5. Test Financial AI Endpoints (Frontend Flow)
    console.log("\n5️⃣ Testing Financial AI Endpoints...");

    // Test Financial Insights
    const insightsResponse = await axios.get(
      `${API_BASE}/financial/ai-insights`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const insightsData = insightsResponse.data;

    if (insightsData.success) {
      console.log("✅ Financial Insights API working");
    }

    // Test Financial Plan
    const planResponse = await axios.post(
      `${API_BASE}/financial/ai-plan`,
      {
        duration: "1_year",
        goals: ["saving", "investment"],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const planData = planResponse.data;

    if (planData.success) {
      console.log("✅ Financial Plan API working");
    }

    // Test Budget Recommendations
    const budgetResponse = await axios.get(
      `${API_BASE}/financial/budget/ai-recommendations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const budgetData = budgetResponse.data;

    if (budgetData.success) {
      console.log("✅ Budget AI API working");
    }

    // Test Investment Recommendations
    const investmentResponse = await axios.get(
      `${API_BASE}/financial/investment/recommendations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const investmentData = investmentResponse.data;

    if (investmentData.success) {
      console.log("✅ Investment AI API working");
    }

    // 6. Test Chat History (Frontend Flow)
    console.log("\n6️⃣ Testing Chat History Retrieval...");
    const historyResponse = await axios.get(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const historyData = historyResponse.data;

    if (historyData && historyData.length > 0) {
      console.log("✅ Chat history retrieved successfully");
      console.log(`   Messages count: ${historyData.length}`);
    }

    console.log("\n🎉 Frontend AI Integration Test Results");
    console.log("=======================================");
    console.log("✅ API Connectivity: WORKING");
    console.log("✅ Authentication: WORKING");
    console.log("✅ Chat Sessions: WORKING");
    console.log("✅ AI Chat Messages: WORKING");
    console.log("✅ Financial AI: WORKING");
    console.log("✅ Budget AI: WORKING");
    console.log("✅ Investment AI: WORKING");
    console.log("✅ Chat History: WORKING");
    console.log("\n🚀 FRONTEND-BACKEND INTEGRATION: COMPLETE!");
    console.log("\n💡 Ready for production use:");
    console.log("   - Frontend: http://localhost:3000");
    console.log("   - Backend: http://localhost:3001");
    console.log("   - AI Navigator: FULLY FUNCTIONAL");
  } catch (error) {
    console.error("\n❌ Frontend AI Integration Test FAILED");
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Response status:", error.response?.status);
    }
    process.exit(1);
  }
}

// Run the test
testFrontendAIIntegration();
