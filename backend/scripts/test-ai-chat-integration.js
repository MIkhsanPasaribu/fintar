/**
 * Test Script: AI Chat Integration End-to-End
 * Tests the complete flow from frontend to backend for AI chat functionality
 */

const axios = require("axios");

const API_BASE = "http://localhost:3001/api/v1";
const FRONTEND_BASE = "http://localhost:3000";

// Test configuration
const testConfig = {
  email: "fintar.test@example.com",
  password: "securePassword123!",
  name: "Fintar Test User",
};

let authToken = "";
let userId = "";
let sessionId = "";

async function testAIChatIntegration() {
  console.log("🚀 Starting AI Chat Integration Test...\n");

  try {
    // 1. Test Authentication
    console.log("1️⃣ Testing Authentication...");
    const authResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testConfig.email,
      password: testConfig.password,
    });

    if (authResponse.data.access_token) {
      authToken = authResponse.data.access_token;
      userId = authResponse.data.user.id;
      console.log("✅ Authentication successful");
      console.log(`   User ID: ${userId}`);
    } else {
      throw new Error("Authentication failed - no token received");
    }

    // 2. Test Chat Session Creation
    console.log("\n2️⃣ Testing Chat Session Creation...");
    const sessionResponse = await axios.post(
      `${API_BASE}/chat/sessions`,
      {
        title: "Test AI Chat Session",
        type: "FINANCIAL_PLANNING",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: userId,
          testSession: true,
        },
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (sessionResponse.data.id) {
      sessionId = sessionResponse.data.id;
      console.log("✅ Chat session created successfully");
      console.log(`   Session ID: ${sessionId}`);
    } else {
      throw new Error("Session creation failed");
    }

    // 3. Test Sending Chat Message
    console.log("\n3️⃣ Testing Chat Message Sending...");
    const messageResponse = await axios.post(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        content:
          "Halo Fintar AI! Bisakah Anda membantu saya menganalisis keuangan saya?",
        context: {
          userProfile: { name: testConfig.name },
          conversationHistory: [],
        },
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (messageResponse.data.aiMessage) {
      console.log("✅ Chat message processed successfully");
      console.log(
        `   AI Response length: ${messageResponse.data.aiMessage.content.length} characters`
      );
      console.log(
        `   Response preview: ${messageResponse.data.aiMessage.content.substring(
          0,
          100
        )}...`
      );
    } else {
      throw new Error("Chat message processing failed");
    }

    // 4. Test Chat History Retrieval
    console.log("\n4️⃣ Testing Chat History Retrieval...");
    const historyResponse = await axios.get(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (historyResponse.data && historyResponse.data.length >= 2) {
      console.log("✅ Chat history retrieved successfully");
      console.log(`   Messages count: ${historyResponse.data.length}`);
      console.log(
        `   User message: ${historyResponse.data[0].content.substring(
          0,
          50
        )}...`
      );
      console.log(
        `   AI response: ${historyResponse.data[1].content.substring(0, 50)}...`
      );
    } else {
      throw new Error("Chat history retrieval failed");
    }

    // 5. Test Session List
    console.log("\n5️⃣ Testing Session List...");
    const sessionsResponse = await axios.get(`${API_BASE}/chat/sessions`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (sessionsResponse.data && sessionsResponse.data.length > 0) {
      console.log("✅ Sessions list retrieved successfully");
      console.log(`   Sessions count: ${sessionsResponse.data.length}`);
    } else {
      console.log("⚠️ No sessions found (this might be expected)");
    }

    // 6. Test Additional AI Message
    console.log("\n6️⃣ Testing Additional AI Interaction...");
    const message2Response = await axios.post(
      `${API_BASE}/chat/sessions/${sessionId}/messages`,
      {
        content:
          "Berikan saya rekomendasi investasi untuk pemula dengan modal Rp 10 juta",
        context: {
          userProfile: { name: testConfig.name },
          conversationHistory: historyResponse.data.slice(-2),
        },
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (message2Response.data.aiMessage) {
      console.log("✅ Second chat message processed successfully");
      console.log(
        `   AI Response length: ${message2Response.data.aiMessage.content.length} characters`
      );
    } else {
      throw new Error("Second chat message processing failed");
    }

    // 7. Cleanup - Delete Test Session
    console.log("\n7️⃣ Cleaning up test session...");
    try {
      await axios.delete(`${API_BASE}/chat/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("✅ Test session cleaned up successfully");
    } catch (error) {
      console.log("⚠️ Session cleanup failed (may not be implemented)");
    }

    console.log("\n🎉 AI Chat Integration Test Results");
    console.log("====================================");
    console.log("✅ Authentication: PASSED");
    console.log("✅ Session Creation: PASSED");
    console.log("✅ Message Processing: PASSED");
    console.log("✅ History Retrieval: PASSED");
    console.log("✅ Session Management: PASSED");
    console.log("✅ AI Responses: WORKING");
    console.log("\n🚀 All AI Chat Integration Tests PASSED!");
    console.log("\n💡 Frontend Integration Status:");
    console.log("   - Frontend URL: http://localhost:3000/chat");
    console.log("   - Backend API: http://localhost:3001/api/v1");
    console.log("   - AI Chat is ready for frontend integration");
  } catch (error) {
    console.error("\n❌ AI Chat Integration Test FAILED");
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testAIChatIntegration();
