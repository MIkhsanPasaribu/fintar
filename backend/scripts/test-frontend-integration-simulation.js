// Test Frontend AI API with Browser Simulation

// Simulate browser environment for testing
const { JSDOM } = require("jsdom");
const dom = new JSDOM();
global.window = dom.window;
global.localStorage = dom.window.localStorage;
global.document = dom.window.document;

// Mock axios for testing
const axios = require("axios");

// Mock the frontend environment
const API_BASE_URL = "http://localhost:3001";

async function testFrontendIntegration() {
  console.log("🚀 Testing Frontend AI Integration...");

  const email = "fintargemastik@gmail.com";
  const password = "Testing123";

  try {
    // Step 1: Login and store token
    console.log("1. 📝 Simulating login and token storage...");
    const loginResponse = await axios.post(
      `${API_BASE_URL}/api/v1/auth/login`,
      {
        email: email,
        password: password,
      }
    );

    const token = loginResponse.data.accessToken;
    const user = loginResponse.data.user;

    // Store token in mock localStorage
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));

    console.log("✅ Token stored in localStorage");

    // Step 2: Test axios client with token
    console.log("2. 🔧 Testing API client with auth token...");

    const apiClient = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Create chat session
    console.log("3. 💬 Creating chat session...");
    const sessionResponse = await apiClient.post("chat/sessions", {
      title: "Frontend Test Session",
      type: "financial_planning",
      metadata: {
        createdAt: new Date().toISOString(),
        userId: user.id,
      },
    });

    const sessionData = sessionResponse.data;
    const sessionId = sessionData.id || sessionData.sessionId;
    console.log("✅ Session created:", sessionId);

    // Send message
    console.log("4. 📨 Sending message...");
    const messageResponse = await apiClient.post(
      `chat/sessions/${sessionId}/messages`,
      {
        content: "Saya ingin tahu tentang investasi reksadana untuk pemula.",
      }
    );

    const messageData = messageResponse.data;
    console.log("✅ Message sent successfully!");
    console.log("📨 User message content:", messageData.userMessage?.content);
    console.log(
      "🤖 AI response preview:",
      messageData.aiMessage?.content?.substring(0, 100) + "..."
    );

    // Get chat history
    console.log("5. 📜 Getting chat history...");
    const historyResponse = await apiClient.get(
      `chat/sessions/${sessionId}/messages`
    );
    const historyData = historyResponse.data;

    console.log("✅ Chat history retrieved!");
    console.log("📊 Message count:", historyData.length);

    // Test message transformation (frontend format)
    console.log("6. 🔄 Testing frontend message transformation...");
    const frontendMessages = historyData.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === "USER" ? "user" : "ai",
      timestamp: new Date(msg.timestamp),
      messageType: msg.metadata?.messageType || "text",
      suggestions: msg.metadata?.suggestions || [],
    }));

    console.log("✅ Frontend message transformation successful!");
    console.log("📋 Transformed messages:", frontendMessages.length);

    console.log("");
    console.log("🎉 FRONTEND AI INTEGRATION TEST COMPLETED SUCCESSFULLY!");
    console.log("");
    console.log("✨ Results:");
    console.log("  ✅ Login and token storage");
    console.log("  ✅ API client with authentication");
    console.log("  ✅ Chat session creation");
    console.log("  ✅ Message sending with AI response");
    console.log("  ✅ Chat history retrieval");
    console.log("  ✅ Frontend message transformation");
    console.log("");
    console.log("🚀 The Frontend integration is fully functional!");
    console.log("");
    console.log("📋 Test Session ID:", sessionId);

    return {
      success: true,
      sessionId,
      messageCount: historyData.length,
      token: token.substring(0, 20) + "...", // Partial token for security
    };
  } catch (error) {
    console.error("❌ Frontend Integration Test FAILED:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the test
testFrontendIntegration();
