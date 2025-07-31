/**
 * Complete Frontend-Backend Integration Debug Script
 * Run this in the backend directory to test if frontend requests would work
 */

const API_BASE_URL = "http://localhost:3001";

async function debugFrontendIntegration() {
  console.log("🔍 Debugging Frontend-Backend Integration...");
  console.log("Backend URL:", API_BASE_URL);

  // 1. Test backend health
  console.log("\n🏥 Testing Backend Health...");
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Backend health check passed:", healthData);
    } else {
      console.log("⚠️ Backend health check failed, but server is running");
    }
  } catch (error) {
    console.log("❌ Backend not accessible:", error.message);
    return;
  }

  // 2. Test authentication
  console.log("\n🔐 Testing Authentication...");
  let authToken = null;
  let userId = null;

  try {
    const loginResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@fintar.com",
        password: "testpassword123",
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log("Login response data:", loginData);
      authToken =
        loginData.accessToken ||
        loginData.data?.access_token ||
        loginData.access_token ||
        loginData.token;
      userId = loginData.user?.id || loginData.data?.user?.id;

      console.log("✅ Authentication successful");
      console.log("User ID:", userId);
      console.log("Token exists:", !!authToken);
    } else {
      console.log("❌ Authentication failed:", loginResponse.status);
      const errorText = await loginResponse.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.log("❌ Authentication error:", error.message);
  }

  if (!authToken || !userId) {
    console.log("🛑 Cannot proceed without authentication");
    return;
  }

  // 3. Test session creation (mimicking frontend)
  console.log("\n💬 Testing Session Creation (Frontend-style)...");
  let sessionId = null;

  try {
    const sessionResponse = await fetch(
      `${API_BASE_URL}/api/v1/chat/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: "Frontend Test Session",
          type: "financial_planning",
          metadata: {
            createdAt: new Date().toISOString(),
            userId: userId,
            source: "frontend_debug",
          },
        }),
      }
    );

    console.log("Session response status:", sessionResponse.status);
    console.log(
      "Session response headers:",
      Object.fromEntries(sessionResponse.headers.entries())
    );

    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      console.log("✅ Session creation successful");
      console.log("Raw response:", sessionData);

      // Try different possible locations for session ID (matching frontend logic)
      sessionId =
        sessionData?.id || sessionData?.sessionId || sessionData?.data?.id;

      if (!sessionId) {
        console.log("❌ Session ID not found in response:");
        console.log("Available keys:", Object.keys(sessionData));
      } else {
        console.log("Session ID:", sessionId);
      }
    } else {
      console.log("❌ Session creation failed");
      const errorText = await sessionResponse.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.log("❌ Session creation error:", error.message);
  }

  if (!sessionId) {
    console.log("🛑 Cannot proceed without session ID");
    return;
  }

  // 4. Test message sending (mimicking frontend)
  console.log("\n📤 Testing Message Sending (Frontend-style)...");

  try {
    const messageResponse = await fetch(
      `${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: "Test message from frontend debug",
          context: {
            conversationHistory: [],
            userProfile: { id: userId },
          },
        }),
      }
    );

    console.log("Message response status:", messageResponse.status);

    if (messageResponse.ok) {
      const messageData = await messageResponse.json();
      console.log("✅ Message sending successful");
      console.log("Raw response:", messageData);

      // Check AI response format (matching frontend expectations)
      const aiResponse =
        messageData?.aiMessage?.content || messageData?.message;

      if (aiResponse) {
        console.log("AI Response:", aiResponse.substring(0, 100) + "...");
      } else {
        console.log("❌ AI response not found in expected format");
        console.log("Available keys:", Object.keys(messageData));
      }
    } else {
      console.log("❌ Message sending failed");
      const errorText = await messageResponse.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.log("❌ Message sending error:", error.message);
    console.log("Full error:", error);
  }

  // 5. Summary
  console.log("\n📋 Integration Test Summary:");
  console.log("- Backend accessible:", "✅");
  console.log("- Authentication:", authToken ? "✅" : "❌");
  console.log("- Session creation:", sessionId ? "✅" : "❌");
  console.log("- Message sending:", "tested above");

  console.log("\n🎯 Next Steps for Frontend:");
  console.log("1. Ensure NEXT_PUBLIC_API_URL = 'http://localhost:3001'");
  console.log("2. Check browser console for CORS errors");
  console.log("3. Verify authentication token storage");
  console.log("4. Test the script in browser console at http://localhost:3000");
}

debugFrontendIntegration();
