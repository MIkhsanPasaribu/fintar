// Frontend AI Chat Integration Test
// This test will login and test the AI chat functionality

async function testFrontendAIChat() {
  console.log("🚀 Starting Frontend AI Chat Integration Test...");

  const baseUrl = "http://localhost:3001";

  try {
    // Step 1: Login to get auth token
    console.log("1. 📝 Logging in to get auth token...");
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@fintar.com",
        password: "test123",
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      throw new Error(`Login failed: ${errorData.message}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    const user = loginData.user;

    console.log("✅ Login successful!", { userId: user.id, email: user.email });

    if (!token) {
      throw new Error("No access token received from login");
    }

    // Step 2: Create AI chat session
    console.log("2. 💬 Creating AI chat session...");
    const sessionResponse = await fetch(`${baseUrl}/api/v1/chat/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Test Chat Session",
      }),
    });

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      throw new Error(`Session creation failed: ${errorData.message}`);
    }

    const sessionData = await sessionResponse.json();
    console.log("✅ Session created successfully!", { sessionData });

    const sessionId =
      sessionData._id || sessionData.sessionId || sessionData.id;
    if (!sessionId) {
      throw new Error(
        "No session ID found in response: " + JSON.stringify(sessionData)
      );
    }

    console.log("📋 Session ID:", sessionId);

    // Step 3: Send a test message
    console.log("3. 📨 Sending test message...");
    const messageResponse = await fetch(
      `${baseUrl}/api/v1/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: "Hello, this is a test message for the AI chatbot.",
          type: "user",
        }),
      }
    );

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(`Message sending failed: ${errorData.message}`);
    }

    const messageData = await messageResponse.json();
    console.log("✅ Message sent successfully!", { messageData });

    // Step 4: Get chat history
    console.log("4. 📜 Retrieving chat history...");
    const historyResponse = await fetch(
      `${baseUrl}/api/v1/chat/sessions/${sessionId}/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!historyResponse.ok) {
      const errorData = await historyResponse.json();
      throw new Error(`History retrieval failed: ${errorData.message}`);
    }

    const historyData = await historyResponse.json();
    console.log("✅ Chat history retrieved successfully!", {
      messageCount: historyData.length || historyData.data?.length || "Unknown",
    });

    console.log("🎉 Frontend AI Chat Integration Test COMPLETED SUCCESSFULLY!");
    console.log("");
    console.log("✨ All tests passed:");
    console.log("  ✅ User login");
    console.log("  ✅ AI chat session creation");
    console.log("  ✅ Message sending");
    console.log("  ✅ Chat history retrieval");
    console.log("");
    console.log("🚀 The AI chat system is ready for use in the frontend!");
    console.log("");
    console.log("Test Credentials:");
    console.log("  Email: test@fintar.com");
    console.log("  Password: test123");

    return {
      success: true,
      token,
      sessionId,
      user,
    };
  } catch (error) {
    console.error(
      "❌ Frontend AI Chat Integration Test FAILED:",
      error.message
    );
    console.error("Full error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the test
testFrontendAIChat();
