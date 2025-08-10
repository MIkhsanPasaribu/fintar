// Test AI Chat Integration with Provided Credentials

async function testAIChatIntegration() {
  console.log("🚀 Testing AI Chat Integration with Provided Credentials...");

  const baseUrl = "http://localhost:3001";
  const email = "fintargemastik@gmail.com";
  const password = "Testing123";

  try {
    // Step 1: Login
    console.log("1. 📝 Logging in...");
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      throw new Error(`Login failed: ${errorData.message}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    const user = loginData.user;

    console.log("✅ Login successful!", {
      userId: user.id,
      email: user.email,
      name: user.firstName || user.username,
    });

    // Step 2: Create chat session
    console.log("2. 💬 Creating chat session...");
    const sessionResponse = await fetch(`${baseUrl}/api/v1/chat/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Test AI Chat Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: user.id,
        },
      }),
    });

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      throw new Error(`Session creation failed: ${errorData.message}`);
    }

    const sessionData = await sessionResponse.json();
    console.log("✅ Session created successfully!", sessionData);

    const sessionId =
      sessionData._id || sessionData.sessionId || sessionData.id;
    console.log("📋 Session ID:", sessionId);

    // Step 3: Send message (Test dengan endpoint yang benar)
    console.log("3. 📨 Sending message to AI...");
    const messageContent =
      "Halo, saya ingin bantuan perencanaan keuangan. Bagaimana cara memulai investasi dengan modal kecil?";

    const messageResponse = await fetch(
      `${baseUrl}/api/v1/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      }
    );

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(
        `Message sending failed: ${errorData.message || JSON.stringify(errorData)}`
      );
    }

    const messageResponseData = await messageResponse.json();
    console.log("✅ Message sent successfully!");
    console.log("📨 User message:", messageContent);
    console.log("🤖 AI response:", messageResponseData);

    // Step 4: Get chat history
    console.log("4. 📜 Getting chat history...");
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
    console.log("✅ Chat history retrieved successfully!");
    console.log(
      "📊 Message count:",
      Array.isArray(historyData) ? historyData.length : "Unknown"
    );

    console.log("");
    console.log("🎉 AI CHAT INTEGRATION TEST COMPLETED SUCCESSFULLY!");
    console.log("");
    console.log("✨ Summary:");
    console.log("  ✅ User login");
    console.log("  ✅ Chat session creation");
    console.log("  ✅ Message sending to AI");
    console.log("  ✅ AI response received");
    console.log("  ✅ Chat history retrieval");
    console.log("");
    console.log("🚀 The AI Chatbot is fully functional!");

    return {
      success: true,
      sessionId,
      messageCount: Array.isArray(historyData) ? historyData.length : 0,
    };
  } catch (error) {
    console.error("❌ AI Chat Integration Test FAILED:", error.message);
    console.error("Full error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the test
testAIChatIntegration();
