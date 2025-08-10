const axios = require("axios");
const colors = require("colors");

// Test configuration
const API_BASE_URL = "http://localhost:3001/api/v1";
const FRONTEND_URL = "http://localhost:3000";

// Test credentials
const TEST_USER = {
  email: "fintargemastik@gmail.com",
  password: "testpassword123",
};

let authToken = null;

async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...headers,
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
}

async function testLogin() {
  console.log("\n🔐 Testing User Authentication...".cyan.bold);

  const result = await makeRequest("POST", "/auth/login", TEST_USER);

  if (result.success && result.data.access_token) {
    authToken = result.data.access_token;
    console.log("✅ Login successful".green);
    console.log(`   User ID: ${result.data.user.id}`.gray);
    console.log(`   Email: ${result.data.user.email}`.gray);
    return true;
  } else {
    console.log("❌ Login failed:".red, result.error);
    return false;
  }
}

async function testUserProfile() {
  console.log("\n👤 Testing User Profile...".cyan.bold);

  const result = await makeRequest("GET", "/users/profile");

  if (result.success) {
    console.log("✅ Profile retrieved successfully".green);
    const profile = result.data;
    console.log(
      `   Monthly Income: ${profile.monthlyIncome || "Not set"}`.gray
    );
    console.log(
      `   Monthly Expenses: ${profile.monthlyExpenses || "Not set"}`.gray
    );
    console.log(
      `   Current Savings: ${profile.currentSavings || "Not set"}`.gray
    );
    console.log(
      `   Risk Tolerance: ${profile.riskTolerance || "Not set"}`.gray
    );
    return profile;
  } else {
    console.log("❌ Profile retrieval failed:".red, result.error);
    return null;
  }
}

async function testInvestmentAIRecommendations() {
  console.log("\n🤖 Testing AI Investment Recommendations...".cyan.bold);

  const result = await makeRequest(
    "GET",
    "/financial/investment/ai-recommendations"
  );

  if (result.success) {
    console.log("✅ AI recommendations retrieved successfully".green);
    const recommendations = result.data;
    console.log(`   Success: ${recommendations.success}`.gray);
    console.log(
      `   Number of recommendations: ${recommendations.recommendations?.length || 0}`
        .gray
    );

    if (recommendations.recommendations?.length > 0) {
      console.log("   Sample recommendation:".gray);
      const sample = recommendations.recommendations[0];
      console.log(`     Type: ${sample.type}`.gray);
      console.log(`     Risk: ${sample.risk}`.gray);
      console.log(`     Return: ${sample.expectedReturn}`.gray);
    }

    return recommendations;
  } else {
    console.log("❌ AI recommendations failed:".red, result.error);
    return null;
  }
}

async function testPortfolioAnalysis() {
  console.log("\n📊 Testing Portfolio Analysis...".cyan.bold);

  const portfolioData = {
    holdings: [
      { symbol: "BBRI", amount: 1000000, type: "stock" },
      { symbol: "BMRI", amount: 800000, type: "stock" },
      { symbol: "TLKM", amount: 600000, type: "stock" },
    ],
  };

  const result = await makeRequest(
    "POST",
    "/financial/investment/ai-analyze",
    portfolioData
  );

  if (result.success) {
    console.log("✅ Portfolio analysis completed successfully".green);
    const analysis = result.data;
    console.log(`   Success: ${analysis.success}`.gray);
    console.log(
      `   Analysis summary available: ${!!analysis.analysis?.summary}`.gray
    );
    return analysis;
  } else {
    console.log("❌ Portfolio analysis failed:".red, result.error);
    return null;
  }
}

async function testMarketTrends() {
  console.log("\n📈 Testing Market Trends Analysis...".cyan.bold);

  const result = await makeRequest(
    "GET",
    "/financial/investment/market-trends"
  );

  if (result.success) {
    console.log("✅ Market trends retrieved successfully".green);
    const trends = result.data;
    console.log(`   Success: ${trends.success}`.gray);
    console.log(
      `   Market summary available: ${!!trends.trends?.summary}`.gray
    );
    console.log(
      `   Number of sectors: ${Object.keys(trends.trends?.sectors || {}).length}`
        .gray
    );
    return trends;
  } else {
    console.log("❌ Market trends retrieval failed:".red, result.error);
    return null;
  }
}

async function testFrontendAccess() {
  console.log("\n🌐 Testing Frontend Access...".cyan.bold);

  try {
    const response = await axios.get(`${FRONTEND_URL}/investment-ai`);
    console.log("✅ Investment AI page accessible".green);
    console.log(`   Status: ${response.status}`.gray);
    return true;
  } catch (error) {
    console.log("❌ Frontend access failed:".red, error.message);
    return false;
  }
}

async function runInvestmentAITests() {
  console.log("🚀 Starting Investment AI End-to-End Tests".blue.bold);
  console.log("================================================".blue);

  let passed = 0;
  let total = 0;

  // Test 1: Authentication
  total++;
  const loginSuccess = await testLogin();
  if (loginSuccess) passed++;

  // Test 2: User Profile
  total++;
  const profile = await testUserProfile();
  if (profile) passed++;

  // Test 3: AI Investment Recommendations
  total++;
  const recommendations = await testInvestmentAIRecommendations();
  if (recommendations) passed++;

  // Test 4: Portfolio Analysis
  total++;
  const analysis = await testPortfolioAnalysis();
  if (analysis) passed++;

  // Test 5: Market Trends
  total++;
  const trends = await testMarketTrends();
  if (trends) passed++;

  // Test 6: Frontend Access
  total++;
  const frontendAccess = await testFrontendAccess();
  if (frontendAccess) passed++;

  // Summary
  console.log("\n📊 Test Results Summary".yellow.bold);
  console.log("========================".yellow);
  console.log(`✅ Passed: ${passed}/${total} tests`.green);
  console.log(`❌ Failed: ${total - passed}/${total} tests`.red);

  if (passed === total) {
    console.log(
      "\n🎉 All tests passed! Investment AI is working correctly!".green.bold
    );
  } else {
    console.log(
      "\n⚠️  Some tests failed. Please check the errors above.".red.bold
    );
  }

  console.log("\n🔗 Quick Links:".cyan.bold);
  console.log(`   Frontend: ${FRONTEND_URL}`.gray);
  console.log(`   Investment AI: ${FRONTEND_URL}/investment-ai`.gray);
  console.log(`   Backend API: ${API_BASE_URL}`.gray);
  console.log(`   API Docs: http://localhost:3001/api/docs`.gray);
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// Run the tests
runInvestmentAITests().catch(console.error);
