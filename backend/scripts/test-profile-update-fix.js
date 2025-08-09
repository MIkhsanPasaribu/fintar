const axios = require("axios");

async function testProfileUpdateFix() {
  try {
    console.log("🔧 Testing Profile Update Fix...");

    // Login
    const loginResponse = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: "fintargemastik@gmail.com",
        password: "Testing123",
      }
    );

    const token = loginResponse.data.access_token;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("✅ Login successful");

    // Test 1: Get current profile
    console.log("\n📋 Getting current profile...");
    try {
      const profileResponse = await axios.get(
        "http://localhost:3001/api/v1/users/profile",
        { headers }
      );
      console.log("✅ Profile retrieved:");
      console.log(
        "  firstName:",
        profileResponse.data.firstName || "❌ Not set"
      );
      console.log("  lastName:", profileResponse.data.lastName || "❌ Not set");
      console.log("  email:", profileResponse.data.email || "❌ Not set");
      console.log(
        "  occupation:",
        profileResponse.data.occupation || "❌ Not set"
      );
    } catch (error) {
      console.log(
        "❌ Failed to get profile:",
        error.response?.data || error.message
      );
    }

    // Test 2: Update profile with PUT (same as frontend uses)
    console.log("\n✏️ Testing profile update with PUT...");
    const profileUpdateData = {
      firstName: "John",
      lastName: "Doe",
      phone: "+6281234567890",
      occupation: "Full Stack Developer",
      company: "Tech Innovators",
      monthlyIncome: 15000000,
      monthlyExpenses: 8000000,
      currentSavings: 50000000,
      financialGoals: [
        "Emergency Fund",
        "Investment Portfolio",
        "House Down Payment",
      ],
    };

    try {
      const updateResponse = await axios.put(
        "http://localhost:3001/api/v1/users/profile",
        profileUpdateData,
        { headers }
      );
      console.log("✅ Profile updated successfully with PUT");
      console.log("  Updated firstName:", updateResponse.data.firstName);
      console.log("  Updated lastName:", updateResponse.data.lastName);
      console.log("  Updated occupation:", updateResponse.data.occupation);
    } catch (error) {
      console.log(
        "❌ PUT update failed:",
        error.response?.data || error.message
      );
    }

    // Test 3: Test partial update with PATCH
    console.log("\n🔧 Testing partial update with PATCH...");
    const partialUpdateData = {
      occupation: "Senior Full Stack Developer",
      monthlyIncome: 18000000,
    };

    try {
      const patchResponse = await axios.patch(
        "http://localhost:3001/api/v1/users/profile",
        partialUpdateData,
        { headers }
      );
      console.log("✅ Profile partially updated successfully with PATCH");
      console.log("  Updated occupation:", patchResponse.data.occupation);
      console.log("  Updated monthlyIncome:", patchResponse.data.monthlyIncome);
    } catch (error) {
      console.log(
        "❌ PATCH update failed:",
        error.response?.data || error.message
      );
    }

    // Test 4: Verify final state
    console.log("\n🔍 Verifying final profile state...");
    try {
      const finalProfileResponse = await axios.get(
        "http://localhost:3001/api/v1/users/profile",
        { headers }
      );
      console.log("✅ Final profile state:");
      console.log(JSON.stringify(finalProfileResponse.data, null, 2));
    } catch (error) {
      console.log(
        "❌ Failed to get final profile:",
        error.response?.data || error.message
      );
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testProfileUpdateFix();
