/**
 * FINTAR AI CHAT - SIMPLE MESSAGE TEST
 * Test dengan pesan sederhana seperti "halo"
 * Paste this script in browser console after logging in
 */

console.log("🚀 FINTAR AI CHAT - SIMPLE MESSAGE TEST");
console.log("=====================================");

async function testSimpleMessage() {
  console.log("📋 TESTING SIMPLE AI CHAT MESSAGES");

  // Step 1: Verify Login Status
  console.log("\n1️⃣ Checking Authentication Status...");
  const authToken = localStorage.getItem("auth_token");
  const userInfo = localStorage.getItem("user_info");

  if (!authToken || !userInfo) {
    console.log("❌ NOT LOGGED IN!");
    console.log("Please login first:");
    console.log("- Go to: http://localhost:3000/login");
    console.log("- Email: test@fintar.com");
    console.log("- Password: testpassword123");
    return;
  }

  const user = JSON.parse(userInfo);
  console.log("✅ Authenticated as:", user.email);
  console.log("🆔 User ID:", user.id);

  // Test different simple messages
  const testMessages = ["halo", "hai", "apa kabar?", "selamat pagi", "test"];

  for (const message of testMessages) {
    console.log(`\n💬 Testing message: "${message}"`);

    try {
      // Create session
      const sessionResponse = await fetch(
        "http://localhost:3001/api/v1/chat/sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: `Test Session - ${message}`,
            type: "financial_planning",
            metadata: {
              createdAt: new Date().toISOString(),
              userId: user.id,
              source: "simple_message_test",
            },
          }),
        }
      );

      if (!sessionResponse.ok) {
        console.log(
          `❌ Session creation failed for "${message}":`,
          sessionResponse.status
        );
        continue;
      }

      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.id;
      console.log(`✅ Session created: ${sessionId}`);

      // Send message
      const messageResponse = await fetch(
        `http://localhost:3001/api/v1/chat/sessions/${sessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            content: message,
            context: {
              conversationHistory: [],
              userProfile: user.profile,
            },
          }),
        }
      );

      console.log(`Response status for "${message}":`, messageResponse.status);

      if (messageResponse.ok) {
        const messageData = await messageResponse.json();
        console.log(
          `✅ AI Response for "${message}":`,
          messageData.aiMessage.content.substring(0, 150) + "..."
        );
        console.log(
          `📊 Model used:`,
          messageData.aiMessage.metadata?.model || "unknown"
        );
        console.log(
          `⏱️ Processing time:`,
          messageData.aiMessage.metadata?.processingTime || "unknown",
          "ms"
        );
      } else {
        const errorText = await messageResponse.text();
        console.log(`❌ Message failed for "${message}":`, errorText);

        // Check if it's a quota error
        if (
          errorText.includes("quota") ||
          errorText.includes("temporarily unavailable")
        ) {
          console.log(
            `⚠️ Quota error detected for "${message}" - stopping test`
          );
          break;
        }
      }

      // Wait a bit between requests to avoid rate limiting
      console.log("⏸️ Waiting 3 seconds before next test...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.log(`❌ Error testing "${message}":`, error.message);
    }
  }

  console.log("\n📋 SIMPLE MESSAGE TEST SUMMARY");
  console.log("=====================================");
  console.log("✅ Authentication: Working");
  console.log("🎯 Next Steps:");
  console.log("1. Go to chat page: http://localhost:3000/chat");
  console.log("2. Try sending simple messages like 'halo'");
  console.log("3. Check if responses are appropriate");
  console.log("4. Monitor for quota errors");
}

// Auto-run the test
testSimpleMessage();

// Helper function
window.testSimple = testSimpleMessage;

console.log("🔧 Helper functions available:");
console.log("- testSimple() - Run simple message test");
