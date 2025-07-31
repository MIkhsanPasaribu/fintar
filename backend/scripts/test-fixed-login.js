// Test login flow yang diperbaiki
const testFixedLogin = async () => {
  try {
    console.log("🔐 Testing FIXED login flow...");

    // Simulate login
    const loginResponse = await fetch(
      "http://localhost:3001/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@fintar.com",
          password: "testpassword123",
        }),
      }
    );

    const loginData = await loginResponse.json();
    console.log("✅ Login successful!");
    console.log(
      "🔑 Access token:",
      loginData.accessToken ? "✅ Found" : "❌ Missing"
    );

    // Store token like frontend does
    const authToken = loginData.accessToken;

    // Now test profile endpoint like useUser does
    console.log("\n🔍 Testing profile endpoint with fixed approach...");
    const profileResponse = await fetch(
      "http://localhost:3001/api/v1/users/profile",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!profileResponse.ok) {
      throw new Error(`Profile request failed: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();
    console.log("✅ Profile endpoint successful!");
    console.log("👤 Profile data structure:");
    console.log("  - id:", profileData.id ? "✅" : "❌");
    console.log("  - email:", profileData.email ? "✅" : "❌");
    console.log(
      "  - firstName:",
      profileData.firstName ? `✅ ${profileData.firstName}` : "❌"
    );
    console.log(
      "  - monthlyIncome:",
      profileData.monthlyIncome ? `✅ ${profileData.monthlyIncome}` : "❌"
    );
    console.log(
      "  - financialGoals:",
      profileData.financialGoals
        ? `✅ ${profileData.financialGoals.length} goals`
        : "❌"
    );

    console.log("\n🎉 Frontend should now work correctly!");
    console.log("💡 Try logging in at http://localhost:3000/login");
    console.log("📧 Email: test@fintar.com");
    console.log("🔒 Password: testpassword123");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

testFixedLogin();
