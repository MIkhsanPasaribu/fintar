const axios = require("axios");

async function testProfileEdit() {
  try {
    console.log("🔐 Testing profile editing after onboarding...");

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
    const profileResponse = await axios.get(
      "http://localhost:3001/api/v1/users/profile",
      { headers }
    );
    console.log(
      "Current Profile:",
      JSON.stringify(profileResponse.data, null, 2)
    );

    // Test 2: Update personal info using the working endpoint
    console.log("\n✏️ Updating personal info using working endpoint...");
    const personalUpdate = {
      occupation: "Senior Software Developer",
      company: "Better Tech Company",
      phone: "+6281234567899",
      maritalStatus: "MARRIED",
      dependents: 1,
    };

    try {
      const personalResponse = await axios.post(
        "http://localhost:3001/api/v1/users/profile",
        personalUpdate,
        { headers }
      );
      console.log(
        "Personal Info Update Response:",
        JSON.stringify(personalResponse.data, null, 2)
      );
    } catch (error) {
      console.log(
        "Personal info update failed (expected if profile exists):",
        error.response?.data?.message
      );
    }

    // Test 3: Update financial info using financial endpoint
    console.log("\n💰 Updating financial info...");
    const financialUpdate = {
      monthlyIncome: 20000000,
      monthlyExpenses: 10000000,
      currentSavings: 75000000,
      financialGoals: [
        "Dana Darurat",
        "Investasi Jangka Panjang",
        "Rumah",
        "Pendidikan",
        "Pensiun",
      ],
      riskTolerance: "HIGH",
    };

    const financialResponse = await axios.post(
      "http://localhost:3001/api/v1/users/financial-data",
      financialUpdate,
      { headers }
    );
    console.log(
      "Financial Info Update Response:",
      JSON.stringify(financialResponse.data, null, 2)
    );

    // Test 3: Verify update persisted
    console.log("\n🔍 Verifying updated profile...");
    const verifyResponse = await axios.get(
      "http://localhost:3001/api/v1/users/profile",
      { headers }
    );
    console.log(
      "Verified Profile:",
      JSON.stringify(verifyResponse.data, null, 2)
    );

    console.log("\n🎯 Profile edit test completed successfully!");
  } catch (error) {
    console.error("\n❌ Profile edit test failed!");

    if (error.response) {
      console.error("📊 Status:", error.response.status);
      console.error("📄 Response data:");
      console.error(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("🌐 No response received from server");
    } else {
      console.error("⚙️ Error:", error.message);
    }
  }
}

testProfileEdit();
