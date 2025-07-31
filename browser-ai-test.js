// Test AI API dari browser console
// Jalankan di http://localhost:3000/chat setelah login

async function testFrontendAI() {
  console.log("🧪 Testing Frontend AI API Integration");

  try {
    // Test 1: Check auth token
    const token = localStorage.getItem("auth_token");
    console.log("1️⃣ Auth token:", token ? "✅ Found" : "❌ Missing");

    if (!token) {
      console.log("❌ Please login first!");
      return;
    }

    // Test 2: Check user profile
    console.log("2️⃣ Testing user profile...");
    const profileResponse = await fetch("/api/v1/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (profileResponse.ok) {
      const user = await profileResponse.json();
      console.log("✅ User profile:", user);

      // Test 3: Create chat session
      console.log("3️⃣ Testing chat session creation...");
      const sessionResponse = await fetch("/api/v1/chat/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: "Browser Test Session",
          type: "financial_planning",
          metadata: {
            createdAt: new Date().toISOString(),
            userId: user.id,
          },
        }),
      });

      console.log("Session response status:", sessionResponse.status);

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log("✅ Session created:", sessionData);
        console.log("Session ID:", sessionData.id);

        if (sessionData.id) {
          // Test 4: Send message
          console.log("4️⃣ Testing message send...");
          const messageResponse = await fetch(
            `/api/v1/chat/sessions/${sessionData.id}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                content: "Halo, berikan analisis keuangan singkat",
              }),
            }
          );

          if (messageResponse.ok) {
            const messageData = await messageResponse.json();
            console.log("✅ Message sent, AI responded:");
            console.log(
              "Response:",
              messageData.aiMessage.content.substring(0, 200) + "..."
            );
          } else {
            const messageError = await messageResponse.json();
            console.log("❌ Message failed:", messageError);
          }
        } else {
          console.log("❌ No session ID in response");
        }
      } else {
        const sessionError = await sessionResponse.json();
        console.log("❌ Session creation failed:", sessionError);
      }
    } else {
      const profileError = await profileResponse.json();
      console.log("❌ Profile fetch failed:", profileError);
    }
  } catch (error) {
    console.log("❌ Test error:", error);
  }
}

// Run the test
testFrontendAI();
