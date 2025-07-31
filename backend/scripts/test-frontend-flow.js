// Test frontend login flow
const testLoginFlow = async () => {
  try {
    console.log("🔐 Testing frontend login flow...");

    // Simulate what frontend does
    const response = await fetch("http://localhost:3001/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@fintar.com",
        password: "testpassword123",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const authData = await response.json();
    console.log("✅ Frontend login successful!");
    console.log("Auth data:", JSON.stringify(authData, null, 2));

    // Test profile endpoint
    console.log("\n🔍 Testing profile endpoint...");
    const profileResponse = await fetch(
      "http://localhost:3001/api/v1/users/profile",
      {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      throw new Error(errorData.message || `HTTP ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();
    console.log("✅ Profile endpoint successful!");
    console.log("Profile data:", JSON.stringify(profileData, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

testLoginFlow();
