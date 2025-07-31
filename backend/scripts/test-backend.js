#!/usr/bin/env node

const axios = require("axios");

const API_BASE_URL = "http://localhost:3001/api/v1";

// Test configuration
const testConfig = {
  email: "test@fintar.com",
  password: "testpassword123",
  firstName: "Test",
  lastName: "User",
};

let authToken = "";

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, useAuth = false) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (useAuth && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
    };
  }
}

// Test functions
async function testHealth() {
  console.log("\n🏥 Testing Health Endpoint...");
  const result = await apiRequest("GET", "/health");

  if (result.success) {
    console.log("✅ Health check passed");
    console.log("   Services:", result.data.services);
    console.log("   Version:", result.data.version);
    console.log("   Uptime:", Math.round(result.data.uptime), "seconds");
  } else {
    console.log("❌ Health check failed:", result.error);
  }

  return result.success;
}

async function testAuth() {
  console.log("\n🔐 Testing Authentication...");

  // Test registration
  console.log("  📝 Testing registration...");
  const registerResult = await apiRequest("POST", "/auth/register", {
    email: testConfig.email,
    password: testConfig.password,
    firstName: testConfig.firstName,
    lastName: testConfig.lastName,
  });

  if (registerResult.success) {
    console.log("✅ Registration successful");
    authToken = registerResult.data.accessToken;
  } else if (registerResult.status === 409) {
    console.log("⚠️ User already exists, trying login...");

    // Try login instead
    const loginResult = await apiRequest("POST", "/auth/login", {
      email: testConfig.email,
      password: testConfig.password,
    });

    if (loginResult.success) {
      console.log("✅ Login successful");
      authToken = loginResult.data.accessToken;
    } else {
      console.log("❌ Login failed:", loginResult.error);
      return false;
    }
  } else {
    console.log("❌ Registration failed:", registerResult.error);
    return false;
  }

  return true;
}

async function testUserProfile() {
  console.log("\n👤 Testing User Profile...");

  // Get profile
  console.log("  📄 Getting user profile...");
  const profileResult = await apiRequest("GET", "/users/profile", null, true);

  if (profileResult.success) {
    console.log("✅ Profile retrieved successfully");
    console.log(
      "   Name:",
      profileResult.data.firstName,
      profileResult.data.lastName
    );
  } else {
    console.log("❌ Failed to get profile:", profileResult.error);
  }

  // Update profile
  console.log("  ✏️ Updating user profile...");
  const updateResult = await apiRequest(
    "PUT",
    "/users/profile",
    {
      phone: "+6281234567890",
      occupation: "Software Developer",
      monthlyIncome: 15000000,
      monthlyExpenses: 8000000,
    },
    true
  );

  if (updateResult.success) {
    console.log("✅ Profile updated successfully");
  } else {
    console.log("❌ Failed to update profile:", updateResult.error);
  }

  return profileResult.success;
}

async function testFinancialData() {
  console.log("\n💰 Testing Financial Data...");

  // Save financial data
  console.log("  💾 Saving financial data...");
  const saveResult = await apiRequest(
    "POST",
    "/financial/data",
    {
      monthlyIncome: 15000000,
      monthlyExpenses: 8000000,
      currentSavings: 50000000,
      currentDebt: 10000000,
      emergencyFundAmount: 24000000,
      riskTolerance: "MODERATE",
      investmentExperience: "Menengah",
      assets: {
        cash: 50000000,
        savings: 100000000,
        property: 500000000,
      },
      liabilities: {
        credit_card: 5000000,
        mortgage: 300000000,
      },
    },
    true
  );

  if (saveResult.success) {
    console.log("✅ Financial data saved successfully");
  } else {
    console.log("❌ Failed to save financial data:", saveResult.error);
  }

  // Get financial summary
  console.log("  📊 Getting financial summary...");
  const summaryResult = await apiRequest(
    "GET",
    "/financial/summary",
    null,
    true
  );

  if (summaryResult.success) {
    console.log("✅ Financial summary retrieved");
    console.log(
      "   Net Worth:",
      summaryResult.data.summary?.netWorth?.toLocaleString("id-ID") || "0"
    );
    console.log(
      "   Monthly Income:",
      summaryResult.data.summary?.monthlyIncome?.toLocaleString("id-ID") || "0"
    );
    console.log(
      "   Monthly Expenses:",
      summaryResult.data.summary?.monthlyExpenses?.toLocaleString("id-ID") ||
        "0"
    );
    console.log(
      "   Net Income:",
      summaryResult.data.summary?.netIncome?.toLocaleString("id-ID") || "0"
    );
  } else {
    console.log("❌ Failed to get financial summary:", summaryResult.error);
  }

  return saveResult.success;
}

async function testInvestmentRecommendations() {
  console.log("\n📈 Testing Investment Recommendations...");

  const result = await apiRequest(
    "GET",
    "/financial/investment/recommendations",
    null,
    true
  );

  if (result.success) {
    console.log("✅ Investment recommendations retrieved");
    console.log("   Risk Tolerance:", result.data.profile?.riskTolerance);
    console.log(
      "   Available for Investment:",
      result.data.profile?.availableForInvestment?.toLocaleString("id-ID")
    );
    console.log(
      "   Recommendations Count:",
      result.data.recommendations?.length || 0
    );
  } else {
    console.log("❌ Failed to get investment recommendations:", result.error);
  }

  return result.success;
}

async function testChatSystem() {
  console.log("\n💬 Testing Chat System...");

  // Create chat session
  console.log("  🆕 Creating chat session...");
  const sessionResult = await apiRequest(
    "POST",
    "/chat/sessions",
    {
      title: "Test Financial Consultation",
      type: "financial_planning",
      metadata: { testSession: true },
    },
    true
  );

  if (!sessionResult.success) {
    console.log("❌ Failed to create chat session:", sessionResult.error);
    return false;
  }

  console.log("✅ Chat session created");
  const sessionId = sessionResult.data.id;

  // Send a test message
  console.log("  📨 Sending test message...");
  const messageResult = await apiRequest(
    "POST",
    `/chat/sessions/${sessionId}/messages`,
    {
      content: "Saya ingin rencana keuangan untuk membeli rumah dalam 3 tahun",
    },
    true
  );

  if (messageResult.success) {
    console.log("✅ AI message processed successfully");
    console.log(
      "   AI Response length:",
      messageResult.data.aiMessage?.content?.length || 0,
      "characters"
    );
  } else {
    console.log("❌ Failed to send message:", messageResult.error);
  }

  // Get chat history
  console.log("  📜 Getting chat history...");
  const historyResult = await apiRequest(
    "GET",
    `/chat/sessions/${sessionId}/messages`,
    null,
    true
  );

  if (historyResult.success) {
    console.log("✅ Chat history retrieved");
    console.log("   Messages count:", historyResult.data.length);
  } else {
    console.log("❌ Failed to get chat history:", historyResult.error);
  }

  return sessionResult.success;
}

async function testConsultants() {
  console.log("\n🏢 Testing Consultants System...");

  // Get consultants list
  console.log("  📋 Getting consultants list...");
  const consultantsResult = await apiRequest("GET", "/consultants", null, true);

  if (consultantsResult.success) {
    console.log("✅ Consultants list retrieved");
    console.log("   Consultants count:", consultantsResult.data.length);

    if (consultantsResult.data.length > 0) {
      const consultant = consultantsResult.data[0];
      console.log("   First consultant:", consultant.name);

      // Test creating a booking
      console.log("  📅 Creating test booking...");
      const bookingResult = await apiRequest(
        "POST",
        "/consultants/bookings",
        {
          consultantId: consultant.id,
          scheduledAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 week from now
          service: "Financial Planning Consultation",
          duration: 60,
          notes: "Test booking for financial planning consultation",
        },
        true
      );

      if (bookingResult.success) {
        console.log("✅ Booking created successfully");
      } else {
        console.log("❌ Failed to create booking:", bookingResult.error);
      }
    }
  } else {
    console.log("❌ Failed to get consultants:", consultantsResult.error);
  }

  return consultantsResult.success;
}

// Main test runner
async function runAllTests() {
  console.log("🧪 Starting Fintar Backend API Tests...");
  console.log("=====================================");

  const tests = [
    { name: "Health Check", func: testHealth },
    { name: "Authentication", func: testAuth },
    { name: "User Profile", func: testUserProfile },
    { name: "Financial Data", func: testFinancialData },
    { name: "Investment Recommendations", func: testInvestmentRecommendations },
    { name: "Chat System", func: testChatSystem },
    { name: "Consultants System", func: testConsultants },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const result = await test.func();
      results.push({ name: test.name, success: result });
    } catch (error) {
      console.log(`❌ ${test.name} failed with error:`, error.message);
      results.push({ name: test.name, success: false });
    }
  }

  // Summary
  console.log("\n📊 Test Results Summary");
  console.log("========================");

  const passed = results.filter((r) => r.success).length;
  const total = results.length;

  results.forEach((result) => {
    console.log(`${result.success ? "✅" : "❌"} ${result.name}`);
  });

  console.log(
    `\n🎯 Overall: ${passed}/${total} tests passed (${Math.round(
      (passed / total) * 100
    )}%)`
  );

  if (passed === total) {
    console.log("🎉 All tests passed! Backend is fully functional.");
  } else {
    console.log("⚠️ Some tests failed. Please check the logs above.");
  }
}

// Run the tests
runAllTests().catch(console.error);
