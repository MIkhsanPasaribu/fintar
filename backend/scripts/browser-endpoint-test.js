// Quick Browser Test for Fixed Endpoints
async function testFixedEndpoints() {
  console.log("🧪 Testing Fixed API Endpoints...");

  try {
    // Get auth token from localStorage
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("❌ No auth token found. Please login first.");
      return;
    }

    console.log("✅ Auth token found");

    // Test 1: User Profile
    console.log("\n1️⃣ Testing User Profile...");
    try {
      const profileResponse = await fetch("/api/v1/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile status:", profileResponse.status);
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        console.log("✅ Profile loaded:", profile.firstName || "User");
      } else {
        console.log("❌ Profile failed:", await profileResponse.text());
      }
    } catch (error) {
      console.log("❌ Profile error:", error.message);
    }

    // Test 2: Chat Session Creation
    console.log("\n2️⃣ Testing Chat Session Creation...");
    try {
      const sessionResponse = await fetch("/api/v1/chat/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Fixed Endpoint Test",
          type: "financial_planning",
          metadata: { test: true },
        }),
      });
      console.log("Session status:", sessionResponse.status);
      if (sessionResponse.ok) {
        const session = await sessionResponse.json();
        console.log("✅ Session created:", session.id);

        // Test 3: Send Message
        console.log("\n3️⃣ Testing Message Send...");
        try {
          const messageResponse = await fetch(
            `/api/v1/chat/sessions/${session.id}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: "Hello, test message!",
              }),
            }
          );
          console.log("Message status:", messageResponse.status);
          if (messageResponse.ok) {
            const messageData = await messageResponse.json();
            console.log("✅ Message sent and AI responded!");
          } else {
            console.log("❌ Message failed:", await messageResponse.text());
          }
        } catch (error) {
          console.log("❌ Message error:", error.message);
        }
      } else {
        console.log("❌ Session failed:", await sessionResponse.text());
      }
    } catch (error) {
      console.log("❌ Session error:", error.message);
    }

    console.log("\n🏁 Endpoint test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testFixedEndpoints();
