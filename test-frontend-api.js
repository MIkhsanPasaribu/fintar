/**
 * Frontend API Test Script
 * Run this in browser console at http://localhost:3000
 */

console.log("🔍 Testing Frontend API Integration...");

async function testFrontendAPI() {
  // 1. Check if user is logged in
  const authToken = localStorage.getItem("auth_token");
  const userInfo = localStorage.getItem("user_info");

  console.log("Auth token exists:", !!authToken);
  console.log("User info exists:", !!userInfo);

  if (!authToken) {
    console.log("❌ No auth token found. Please login first!");
    console.log("Go to: http://localhost:3000/login");
    console.log("Email: test@fintar.com");
    console.log("Password: testpassword123");
    return;
  }

  let user;
  try {
    user = JSON.parse(userInfo);
    console.log("User ID:", user.id);
  } catch (e) {
    console.log("❌ Could not parse user info");
    return;
  }

  // 2. Test Session Creation
  console.log("\n🧪 Testing Session Creation...");
  try {
    const response = await fetch("http://localhost:3001/api/v1/chat/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: "Frontend Browser Test Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: user.id,
          source: "frontend_browser_test",
        },
      }),
    });

    console.log("Session response status:", response.status);
    console.log(
      "Session response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const sessionData = await response.json();
      console.log("✅ Session creation successful!");
      console.log("Raw session data:", sessionData);
      console.log("Session ID:", sessionData.id);

      // 3. Test Message Sending
      console.log("\n💬 Testing Message Sending...");
      const messageResponse = await fetch(
        `http://localhost:3001/api/v1/chat/sessions/${sessionData.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            content: "Test message from frontend",
          }),
        }
      );

      if (messageResponse.ok) {
        const messageData = await messageResponse.json();
        console.log("✅ Message sending successful!");
        console.log(
          "AI Response:",
          messageData.aiMessage.content.substring(0, 100) + "..."
        );
      } else {
        console.log("❌ Message sending failed");
        console.log("Status:", messageResponse.status);
        console.log("Error:", await messageResponse.text());
      }
    } else {
      console.log("❌ Session creation failed");
      console.log("Status:", response.status);
      console.log("Error:", await response.text());
    }
  } catch (error) {
    console.log("❌ API test failed:", error);
  }

  // 4. Test using app's api client if available
  console.log("\n🔧 Testing App's API Client...");
  try {
    // Try to access the API service from window if exposed
    if (window.AIService) {
      console.log("Found AIService on window");
      const sessionId = await window.AIService.createChatSession(user.id);
      console.log("✅ AIService.createChatSession successful:", sessionId);
    } else {
      console.log("ℹ️ AIService not exposed on window (this is normal)");
    }
  } catch (error) {
    console.log("❌ AIService test failed:", error);
  }
}

testFrontendAPI();
