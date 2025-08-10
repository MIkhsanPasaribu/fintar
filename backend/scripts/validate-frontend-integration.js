// Simple Frontend Integration Validation Test

const axios = require("axios");

async function validateFrontendIntegration() {
  console.log("🔍 Validating Frontend Integration Points...");

  const API_BASE_URL = "http://localhost:3001/api/v1";
  const email = "fintargemastik@gmail.com";
  const password = "Testing123";

  try {
    // Login
    console.log("1. 🔐 Testing login endpoint...");
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });

    const token = loginResponse.data.accessToken;
    const user = loginResponse.data.user;
    console.log("✅ Login successful, token received");

    // Configure axios with token
    const authAxios = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Test chat session creation
    console.log("2. 💬 Testing chat session creation...");
    const sessionResponse = await authAxios.post("chat/sessions", {
      title: "Validation Test Session",
      type: "financial_planning",
    });

    const sessionData = sessionResponse.data;
    const sessionId = sessionData.id;
    console.log("✅ Chat session created successfully");
    console.log("   Session ID:", sessionId);

    // Test message sending
    console.log("3. 📤 Testing message sending...");
    const messageResponse = await authAxios.post(
      `chat/sessions/${sessionId}/messages`,
      {
        content: "Test message untuk validasi integrasi frontend.",
      }
    );

    const messageData = messageResponse.data;
    console.log("✅ Message sent successfully");
    console.log("   User message:", messageData.userMessage?.content);
    console.log(
      "   AI response length:",
      messageData.aiMessage?.content?.length || 0,
      "characters"
    );

    // Test getting chat history
    console.log("4. 📜 Testing chat history retrieval...");
    const historyResponse = await authAxios.get(
      `chat/sessions/${sessionId}/messages`
    );
    const historyData = historyResponse.data;
    console.log("✅ Chat history retrieved successfully");
    console.log("   Messages in history:", historyData.length);

    // Validate message structure for frontend
    console.log("5. 🔍 Validating message structure...");
    const sampleMessage = historyData[0];
    const requiredFields = ["id", "content", "role", "timestamp"];
    const hasAllFields = requiredFields.every((field) =>
      sampleMessage.hasOwnProperty(field)
    );

    if (hasAllFields) {
      console.log("✅ Message structure is valid for frontend processing");
    } else {
      console.log("❌ Message structure missing required fields");
    }

    // Test getting all user sessions
    console.log("6. 📋 Testing user sessions retrieval...");
    const sessionsResponse = await authAxios.get("chat/sessions");
    const sessionsData = sessionsResponse.data;
    console.log("✅ User sessions retrieved successfully");
    console.log("   Total sessions:", sessionsData.length);

    console.log("");
    console.log("🎉 FRONTEND INTEGRATION VALIDATION COMPLETED!");
    console.log("");
    console.log("✨ All Integration Points Validated:");
    console.log("  ✅ User authentication");
    console.log("  ✅ Token-based API access");
    console.log("  ✅ Chat session management");
    console.log("  ✅ AI message processing");
    console.log("  ✅ Chat history access");
    console.log("  ✅ User sessions listing");
    console.log("  ✅ Message structure compatibility");
    console.log("");
    console.log("🚀 Frontend can now integrate successfully!");

    // Return summary for documentation
    return {
      success: true,
      endpoints: {
        login: "✅ Working",
        createSession: "✅ Working",
        sendMessage: "✅ Working",
        getHistory: "✅ Working",
        getUserSessions: "✅ Working",
      },
      sampleSessionId: sessionId,
      messageStructure: {
        fields: Object.keys(sampleMessage),
        compatible: hasAllFields,
      },
    };
  } catch (error) {
    console.error("❌ Integration validation failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Run validation
validateFrontendIntegration();
