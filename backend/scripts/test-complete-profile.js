const axios = require("axios");

async function testCompleteProfile() {
  try {
    console.log("🔧 Testing Complete Profile Fix...");

    // Step 1: Create test user
    console.log("\n1. 👤 Creating test user...");
    try {
      const registerResponse = await axios.post(
        "http://localhost:3001/api/v1/auth/register",
        {
          firstName: "Test",
          lastName: "User Profile",
          email: `test-profile-${Date.now()}@example.com`,
          password: "Testing123",
        }
      );
      console.log("✅ User created successfully");
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("ℹ️  User already exists, proceeding...");
      } else {
        throw error;
      }
    }

    // Step 2: Login with existing user
    console.log("\n2. 🔐 Logging in...");
    const loginResponse = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: "fintargemastik@gmail.com",
        password: "Testing123",
      }
    );

    const token = loginResponse.data.accessToken;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("✅ Login successful");

    // Step 3: Get current profile
    console.log("\n3. 📋 Getting current profile...");
    try {
      const profileResponse = await axios.get(
        "http://localhost:3001/api/v1/users/profile",
        { headers }
      );
      console.log("✅ Profile retrieved:", {
        firstName: profileResponse.data.firstName,
        lastName: profileResponse.data.lastName,
        email: profileResponse.data.email,
        phone: profileResponse.data.phone,
      });
    } catch (error) {
      console.log(
        "❌ Profile get failed:",
        error.response?.data || error.message
      );
      return;
    }

    // Step 4: Update profile with complete data
    console.log("\n4. ✏️ Updating profile with complete data...");
    const updateData = {
      firstName: "John Updated",
      lastName: "Doe Updated",
      phone: "+6281234567890",
      occupation: "Senior Developer",
      company: "Fintar Tech",
      monthlyIncome: 15000000,
      monthlyExpenses: 8000000,
      currentSavings: 50000000,
      riskTolerance: "MODERATE",
      financialGoals: ["Emergency Fund", "Buy House", "Retirement"],
    };

    try {
      const updateResponse = await axios.put(
        "http://localhost:3001/api/v1/users/profile",
        updateData,
        { headers }
      );
      console.log("✅ Profile updated successfully");
      console.log("Updated data:", {
        firstName: updateResponse.data.firstName,
        lastName: updateResponse.data.lastName,
        phone: updateResponse.data.phone,
        occupation: updateResponse.data.occupation,
        monthlyIncome: updateResponse.data.monthlyIncome,
        financialGoals: updateResponse.data.financialGoals,
      });
    } catch (error) {
      console.log("❌ Profile update failed:");
      console.log("Response:", error.response?.data);
      console.log("Status:", error.response?.status);
    }

    console.log("\n🎉 Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testCompleteProfile();
