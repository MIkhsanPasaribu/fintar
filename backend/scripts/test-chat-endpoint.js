/**
 * Quick test for chat session creation endpoint
 */

const axios = require("axios");

const API_BASE = "http://localhost:3001/api/v1";

async function testChatEndpoint() {
  console.log("🚀 Testing Chat Endpoint...\n");

  try {
    // 1. Login to get token
    console.log("1️⃣ Getting auth token...");
    const authResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@fintar.com",
      password: "testpassword123",
    });

    const authToken = authResponse.data.accessToken;
    const userId = authResponse.data.user.id;
    console.log("✅ Authentication successful");
    console.log(`   User ID: ${userId}`);
    console.log(`   Token: ${authToken.substring(0, 20)}...`);

    // 2. Test Chat Session Creation
    console.log("\n2️⃣ Testing Chat Session Creation...");
    const sessionResponse = await axios.post(
      `${API_BASE}/chat/sessions`,
      {
        title: "Test AI Chat Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Chat Session Creation successful!");
    console.log(
      "Session Response:",
      JSON.stringify(sessionResponse.data, null, 2)
    );

    const sessionId = sessionResponse.data.id || sessionResponse.data.sessionId;
    console.log(`📝 Session ID: ${sessionId}`);

    // 3. Test sending a message
    if (sessionId) {
      console.log("\n3️⃣ Testing Message Sending...");
      const messageResponse = await axios.post(
        `${API_BASE}/chat/sessions/${sessionId}/messages`,
        {
          content: "Hello, can you help me with my finances?",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Message Sending successful!");
      console.log(
        "Message Response:",
        JSON.stringify(messageResponse.data, null, 2)
      );
    }
  } catch (error) {
    console.error("❌ Test FAILED");
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

testChatEndpoint();
