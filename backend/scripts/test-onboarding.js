const axios = require("axios");

async function testOnboardingFlow() {
  try {
    // Simulasi login untuk mendapatkan token
    console.log("🔐 Getting auth token...");
    const loginResponse = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: "fintargemastik@gmail.com",
        password: "Testing123",
      }
    );

    const token = loginResponse.data.access_token;
    const userId = loginResponse.data.user.id;
    console.log(`✅ Login successful. User ID: ${userId}`);

    // Headers dengan authorization
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Test 1: Get onboarding status
    console.log("\n📊 Testing onboarding status...");
    const statusResponse = await axios.get(
      "http://localhost:3001/api/v1/users/onboarding/status",
      { headers }
    );
    console.log(
      "Onboarding Status:",
      JSON.stringify(statusResponse.data, null, 2)
    );

    // Test 2: Update personal info (onboarding step 1)
    console.log("\n👤 Testing personal info update...");
    const personalInfo = {
      dateOfBirth: "1995-06-15T00:00:00.000Z",
      gender: "MALE",
      occupation: "Software Developer",
      company: "Tech Company",
      phone: "+6281234567890",
      maritalStatus: "SINGLE",
      dependents: 0,
    };

    const personalResponse = await axios.patch(
      "http://localhost:3001/api/v1/users/profile",
      personalInfo,
      { headers }
    );
    console.log(
      "Personal Info Update:",
      JSON.stringify(personalResponse.data, null, 2)
    );

    // Test 3: Update financial goals (financial info step)
    console.log("\n💰 Testing financial goals update...");
    const financialGoals = [
      "Dana Darurat",
      "Investasi Jangka Panjang",
      "Rumah",
      "Pendidikan",
    ];

    const financialResponse = await axios.post(
      "http://localhost:3001/api/v1/users/financial-data",
      {
        financialGoals: financialGoals,
        monthlyIncome: 15000000,
        monthlyExpenses: 8000000,
        currentSavings: 50000000,
        riskTolerance: "MODERATE",
      },
      { headers }
    );
    console.log(
      "Financial Goals Update:",
      JSON.stringify(financialResponse.data, null, 2)
    );

    // Test 4: Complete profile step
    console.log("\n✅ Testing profile step completion...");
    const completeProfileResponse = await axios.patch(
      "http://localhost:3001/api/v1/users/onboarding/profile",
      {
        completed: true,
      },
      { headers }
    );
    console.log(
      "Profile Step Complete:",
      JSON.stringify(completeProfileResponse.data, null, 2)
    );

    // Test 5: Complete financial step
    console.log("\n💰 Testing financial step completion...");
    const completeFinancialResponse = await axios.patch(
      "http://localhost:3001/api/v1/users/onboarding/financial",
      {
        completed: true,
      },
      { headers }
    );
    console.log(
      "Financial Step Complete:",
      JSON.stringify(completeFinancialResponse.data, null, 2)
    );

    // Test 6: Check final onboarding status
    console.log("\n📋 Checking final onboarding status...");
    const finalStatusResponse = await axios.get(
      "http://localhost:3001/api/v1/users/onboarding/status",
      { headers }
    );
    console.log(
      "Final Onboarding Status:",
      JSON.stringify(finalStatusResponse.data, null, 2)
    );
  } catch (error) {
    console.error("\n❌ Test failed!");

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

testOnboardingFlow();
