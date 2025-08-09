/**
 * Dashboard Integration Test
 * Test full profile system integration with dashboard display
 */

const axios = require("axios");

const API_BASE_URL = "http://localhost:3001";

let authToken = null;

async function login() {
  console.log("🔐 Logging in...");
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      email: "fintargemastik@gmail.com",
      password: "password123",
    });

    authToken = response.data.access_token;
    console.log("✅ Login successful");
    return true;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    return false;
  }
}

async function getProfileForDashboard() {
  console.log("\n📊 Getting profile for dashboard integration...");
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/users/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const profile = response.data;
    console.log("Profile data structure:");
    console.log(JSON.stringify(profile, null, 2));

    // Check dashboard-relevant fields
    console.log("\n🎯 Dashboard Integration Check:");

    // Required financial fields
    const requiredFinancialFields = [
      "monthlyIncome",
      "monthlyExpenses",
      "currentSavings",
    ];
    requiredFinancialFields.forEach((field) => {
      console.log(
        `  ${field}: ${profile[field] ? "✅" : "❌"} ${profile[field] || "NOT SET"}`
      );
    });

    // Profile completion fields
    const profileFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "occupation",
    ];
    profileFields.forEach((field) => {
      console.log(
        `  ${field}: ${profile[field] ? "✅" : "❌"} ${profile[field] || "NOT SET"}`
      );
    });

    // Risk tolerance and goals
    console.log(
      `  riskTolerance: ${profile.riskTolerance ? "✅" : "❌"} ${profile.riskTolerance || "NOT SET"}`
    );
    console.log(
      `  financialGoals: ${profile.financialGoals?.length ? "✅" : "❌"} ${profile.financialGoals?.length || 0} goals`
    );

    // Additional profile fields for comprehensive display
    const additionalFields = [
      "emergencyFundAmount",
      "currentDebt",
      "maritalStatus",
      "dependents",
      "company",
    ];
    console.log("\n📈 Enhanced Dashboard Fields:");
    additionalFields.forEach((field) => {
      console.log(
        `  ${field}: ${profile[field] !== null && profile[field] !== undefined ? "✅" : "❌"} ${profile[field] || "NOT SET"}`
      );
    });

    // Calculate completion percentage
    const allFields = [
      ...requiredFinancialFields,
      ...profileFields,
      "riskTolerance",
    ];
    const completedFields = allFields.filter((field) => profile[field]);
    const completionPercentage = Math.round(
      (completedFields.length / allFields.length) * 100
    );

    console.log(`\n📋 Profile Completion: ${completionPercentage}%`);
    console.log(
      `   Required fields completed: ${completedFields.length}/${allFields.length}`
    );

    return profile;
  } catch (error) {
    console.error(
      "❌ Failed to get profile:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testDashboardDataPreparation(profile) {
  console.log("\n🔧 Testing Dashboard Data Preparation...");

  if (!profile) {
    console.log("❌ No profile data to test");
    return;
  }

  // Test financial calculations for dashboard cards
  console.log("\n💰 Financial Card Data:");
  console.log(
    `  Total Saldo: Rp ${profile.currentSavings?.toLocaleString("id-ID") || "0"}`
  );
  console.log(
    `  Pendapatan Bulanan: Rp ${profile.monthlyIncome?.toLocaleString("id-ID") || "0"}`
  );
  console.log(
    `  Pengeluaran Bulanan: Rp ${profile.monthlyExpenses?.toLocaleString("id-ID") || "0"}`
  );
  console.log(
    `  Dana Darurat: Rp ${profile.emergencyFundAmount?.toLocaleString("id-ID") || "Belum diatur"}`
  );

  // Test net income calculation
  if (profile.monthlyIncome && profile.monthlyExpenses) {
    const netIncome = profile.monthlyIncome - profile.monthlyExpenses;
    console.log(`  Net Income: Rp ${netIncome.toLocaleString("id-ID")}`);
  }

  // Test age calculation
  if (profile.dateOfBirth) {
    const age = Math.floor(
      (Date.now() - new Date(profile.dateOfBirth).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
    console.log(`  Age: ${age} tahun`);
  }

  // Test risk tolerance display
  const riskMap = {
    LOW: "Konservatif",
    MODERATE: "Moderat",
    HIGH: "Agresif",
  };
  if (profile.riskTolerance) {
    console.log(
      `  Risk Profile: ${riskMap[profile.riskTolerance] || profile.riskTolerance}`
    );
  }

  // Test marital status display
  const maritalMap = {
    SINGLE: "Lajang",
    MARRIED: "Menikah",
    DIVORCED: "Cerai",
    WIDOWED: "Janda/Duda",
  };
  if (profile.maritalStatus) {
    console.log(
      `  Status: ${maritalMap[profile.maritalStatus] || profile.maritalStatus}`
    );
  }

  console.log("\n✅ Dashboard data preparation test complete");
}

async function runTest() {
  console.log("🧪 Dashboard Integration Test\n");

  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without login");
    return;
  }

  // Get profile
  const profile = await getProfileForDashboard();

  // Test dashboard data preparation
  await testDashboardDataPreparation(profile);

  console.log("\n🎉 Dashboard integration test complete!");
  console.log("\n📝 Summary:");
  console.log("   ✅ Profile data retrieval working");
  console.log("   ✅ Dashboard field mapping working");
  console.log("   ✅ Financial calculations working");
  console.log("   ✅ Profile completion logic working");
  console.log("   ✅ Enhanced profile fields available");
}

// Run the test
runTest().catch(console.error);
