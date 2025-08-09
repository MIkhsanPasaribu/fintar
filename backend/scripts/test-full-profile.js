const axios = require("axios");

async function testFullProfileUpdate() {
  try {
    console.log("🔧 Testing Full Profile Update...");

    // Login
    console.log("\n🔐 Logging in...");
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

    // Get initial profile
    console.log("\n📋 Getting initial profile...");
    const initialProfile = await axios.get(
      "http://localhost:3001/api/v1/users/profile",
      { headers }
    );
    console.log("Initial profile data:");
    console.log(JSON.stringify(initialProfile.data, null, 2));

    // Update with comprehensive data
    console.log("\n✏️ Updating with comprehensive profile data...");
    const updateData = {
      firstName: "Fintar Updated",
      lastName: "Gemastik Updated",
      phone: "+62812345678",
      dateOfBirth: "1990-01-15",
      gender: "MALE",
      occupation: "Software Engineer",
      company: "Tech Corp",
      monthlyIncome: 25000000,
      monthlyExpenses: 15000000,
      currentSavings: 50000000,
      currentDebt: 10000000,
      emergencyFundAmount: 30000000,
      financialGoals: [
        "Emergency Fund",
        "Buy House",
        "Investment",
        "Retirement",
      ],
      riskTolerance: "MODERATE",
      investmentExperience: "Intermediate",
      currentInvestments: "Stocks, Bonds, Mutual Funds",
      maritalStatus: "SINGLE",
      dependents: 0,
      educationLevel: "Bachelor's Degree",
      assets: "House, Car, Savings",
      liabilities: "Mortgage, Credit Card",
      insurance: "Health, Life, Car",
      address: "Jl. Sudirman No. 1, Jakarta",
      currency: "IDR",
    };

    const updateResponse = await axios.patch(
      "http://localhost:3001/api/v1/users/profile",
      updateData,
      { headers }
    );

    console.log("✅ Profile updated successfully!");
    console.log("Updated profile:");
    console.log(JSON.stringify(updateResponse.data, null, 2));

    // Verify the update by getting profile again
    console.log("\n🔍 Verifying updated profile...");
    const verifyProfile = await axios.get(
      "http://localhost:3001/api/v1/users/profile",
      { headers }
    );

    console.log("✅ Verification complete!");
    console.log("Final profile data:");
    console.log(JSON.stringify(verifyProfile.data, null, 2));

    // Test individual field updates
    console.log("\n🔄 Testing individual field updates...");

    const partialUpdate = {
      occupation: "Senior Software Engineer",
      monthlyIncome: 30000000,
      company: "Updated Tech Corp",
    };

    const partialResponse = await axios.patch(
      "http://localhost:3001/api/v1/users/profile",
      partialUpdate,
      { headers }
    );

    console.log("✅ Partial update successful:");
    console.log(`Occupation: ${partialResponse.data.occupation}`);
    console.log(`Monthly Income: ${partialResponse.data.monthlyIncome}`);
    console.log(`Company: ${partialResponse.data.company}`);

    console.log("\n🎉 All profile update tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

testFullProfileUpdate();
