/**
 * Complete AI Chat Debug Test Script
 * Tests entire flow from session creation to message sending
 */

const axios = require("axios");

const API_BASE = "http://localhost:3001/api/v1";
let authToken = "";
let userId = "";
let sessionId = "";

async function testCompleteAIChat() {
  console.log("🔍 COMPLETE AI CHAT DEBUG TEST\n");

  try {
    // 1. Login
    console.log("1️⃣ Testing Login...");
    const authResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@fintar.com",
      password: "testpassword123",
    });

    authToken = authResponse.data.accessToken;
    userId = authResponse.data.user.id;
    console.log("✅ Login successful");
    console.log(`   User ID: ${userId}`);
    console.log(`   Token: ${authToken.substring(0, 30)}...`);

    // 2. Test Session Creation
    console.log("\n2️⃣ Testing Session Creation...");
    const sessionResponse = await axios.post(
      `${API_BASE}/chat/sessions`,
      {
        title: "Debug Test Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: userId,
          source: "debug_test",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    sessionId = sessionResponse.data.id;
    console.log("✅ Session creation successful");
    console.log(`   Session ID: ${sessionId}`);
    console.log(
      "   Full response:",
      JSON.stringify(sessionResponse.data, null, 2)
    );

    // 3. Test Message Sending (Simple)
    console.log("\n3️⃣ Testing Simple Message...");
    try {
      const simpleMessageResponse = await axios.post(
        `${API_BASE}/chat/sessions/${sessionId}/messages`,
        {
          content: "Halo",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Simple message successful!");
      console.log(
        "Response:",
        JSON.stringify(simpleMessageResponse.data, null, 2)
      );
    } catch (messageError) {
      console.log("❌ Simple message failed");
      console.log("Status:", messageError.response?.status);
      console.log("Error data:", messageError.response?.data);
      console.log("Full error:", messageError.message);
    }

    // 4. Test Financial Message
    console.log("\n4️⃣ Testing Financial Message...");
    try {
      const financialMessageResponse = await axios.post(
        `${API_BASE}/chat/sessions/${sessionId}/messages`,
        {
          content: "Bagaimana cara mengatur budget bulanan yang baik?",
          context: {
            userProfile: {
              monthlyIncome: 10000000,
              riskTolerance: "medium",
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Financial message successful!");
      console.log(
        "Response:",
        JSON.stringify(financialMessageResponse.data, null, 2)
      );
    } catch (messageError) {
      console.log("❌ Financial message failed");
      console.log("Status:", messageError.response?.status);
      console.log("Error data:", messageError.response?.data);
    }

    // 5. Test Health Check
    console.log("\n5️⃣ Testing AI Health Check...");
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("✅ Health check successful");
      console.log(
        "Health status:",
        JSON.stringify(healthResponse.data, null, 2)
      );
    } catch (healthError) {
      console.log("❌ Health check failed");
      console.log("Status:", healthError.response?.status);
      console.log("Error:", healthError.response?.data);
    }
  } catch (error) {
    console.error("❌ Test failed at top level:");
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testCompleteAIChat();
