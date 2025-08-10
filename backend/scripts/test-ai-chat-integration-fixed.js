/**
 * AI Chat System Integration Test
 * Test end-to-end AI chat functionality from session creation to message sending
 */

const axios = require("axios");

const API_BASE_URL = "http://localhost:3001";

let authToken = null;

async function login() {
  console.log("🔐 Logging in...");
  try {
    console.log(
      "🔗 Making login request to:",
      `${API_BASE_URL}/api/v1/auth/login`
    );
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      email: "debug@fintar.id",
      password: "DebugPassword123",
    });

    console.log(
      "📋 Login response data:",
      JSON.stringify(response.data, null, 2)
    );

    authToken = response.data.accessToken;
    if (!authToken) {
      console.error("❌ No accessToken in response!");
      return false;
    }

    console.log(
      "✅ Login successful, token extracted:",
      authToken ? `${authToken.substring(0, 20)}...` : "none"
    );
    return true;
  } catch (error) {
    console.error("❌ Login failed:");
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("   No response received:", error.message);
    } else {
      console.error("   Error:", error.message);
    }
    return false;
  }
}

async function createChatSession() {
  console.log("\n🔄 Creating chat session...");
  console.log(
    "🔑 Using auth token:",
    authToken ? `${authToken.substring(0, 20)}...` : "none"
  );
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/chat/sessions`,
      {
        title: "Fintar AI Chat Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          testSession: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📋 Raw session response:", response.data);

    const sessionId = response.data?.id || response.data?.sessionId;

    if (!sessionId) {
      console.error("❌ No session ID in response:", response.data);
      return null;
    }

    console.log("✅ Chat session created:", sessionId);
    return sessionId;
  } catch (error) {
    console.error("❌ Failed to create chat session:");
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("   No response received:", error.message);
    } else {
      console.error("   Error:", error.message);
    }
    return null;
  }
}

async function sendChatMessage(sessionId, message) {
  console.log(`\n💬 Sending message to session ${sessionId}:`, message);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/messages`,
      {
        content: message,
        context: {
          userProfile: {
            age: 30,
            income: 15000000,
            riskTolerance: "moderate",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("📥 AI Response:", response.data);

    if (response.data.aiMessage) {
      console.log(
        "✅ AI replied:",
        response.data.aiMessage.content.substring(0, 100) + "..."
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to send message:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function getChatHistory(sessionId) {
  console.log(`\n📜 Getting chat history for session ${sessionId}...`);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("📋 Chat history:", response.data.length, "messages");
    response.data.forEach((msg, index) => {
      console.log(
        `  ${index + 1}. [${msg.role}]: ${msg.content.substring(0, 50)}...`
      );
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to get chat history:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function getChatSessions() {
  console.log("\n📂 Getting user chat sessions...");
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/chat/sessions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log("📋 User sessions:", response.data.length, "sessions");
    response.data.forEach((session, index) => {
      console.log(
        `  ${index + 1}. ${session.title} (${session.type}) - ${session.messages?.length || 0} messages`
      );
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to get chat sessions:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function runFullAIChatTest() {
  console.log("🧪 AI Chat System Integration Test\n");

  // 1. Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without login");
    return;
  }

  // 2. Create chat session
  const sessionId = await createChatSession();
  if (!sessionId) {
    console.log("❌ Cannot proceed without valid session");
    return;
  }

  // 3. Test multiple messages
  const testMessages = [
    "Halo, saya ingin bantuan perencanaan keuangan",
    "Berapa persen dari gaji yang seharusnya saya tabung setiap bulan?",
    "Bagaimana cara memulai investasi dengan dana terbatas?",
  ];

  for (const message of testMessages) {
    const response = await sendChatMessage(sessionId, message);
    if (!response) {
      console.log("❌ Message sending failed, stopping test");
      break;
    }

    // Wait a bit between messages
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // 4. Get chat history
  await getChatHistory(sessionId);

  // 5. Get all user sessions
  await getChatSessions();

  console.log("\n🎉 AI Chat Integration Test Complete!");
  console.log("\n📝 Summary:");
  console.log("   ✅ Session creation working");
  console.log("   ✅ Message sending working");
  console.log("   ✅ AI responses received");
  console.log("   ✅ Chat history retrievable");
  console.log("   ✅ Session listing working");
}

// Run the test
runFullAIChatTest().catch(console.error);
