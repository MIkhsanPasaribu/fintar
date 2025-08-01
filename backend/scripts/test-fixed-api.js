// Quick test untuk verify API URL fix
async function testFixedAPI() {
  console.log("🔧 Testing Fixed API URLs");

  const token = localStorage.getItem("auth_token");
  console.log("1️⃣ Auth token:", token ? "✅ Found" : "❌ Missing");

  if (!token) {
    console.log("❌ Please login first!");
    return;
  }

  try {
    // Test dengan URL yang benar sekarang
    console.log("2️⃣ Testing session creation with fixed URL...");
    const response = await fetch("http://localhost:3001/api/v1/chat/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Fixed URL Test Session",
        type: "financial_planning",
        metadata: { test: true },
      }),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ SUCCESS! Response data:", data);
      console.log("✅ Session ID:", data.id);

      // Test frontend API client sekarang
      console.log("3️⃣ Testing frontend API client...");
      try {
        // Import AI API yang sudah di-fix
        const { AIService } = await import("/src/lib/ai-api.ts");
        const sessionId = await AIService.createChatSession("test-user");
        console.log("✅ Frontend API client works! Session ID:", sessionId);
      } catch (frontendError) {
        console.log("❌ Frontend API error:", frontendError);
      }
    } else {
      const errorData = await response.text();
      console.log("❌ Session creation failed:", errorData);
    }
  } catch (error) {
    console.log("❌ Error:", error);
  }
}

testFixedAPI();
