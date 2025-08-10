const axios = require("axios");

// Test configuration
const API_BASE_URL = "http://localhost:3001/api/v1";

async function testHealthCheck() {
  console.log("🏥 Testing Health Check...");

  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log("✅ Health check passed:", response.data);
    return true;
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
    return false;
  }
}

async function testBackendConnectivity() {
  console.log("🔗 Testing Backend Connectivity...");

  try {
    // Test basic connectivity
    const healthCheck = await testHealthCheck();

    // Test API documentation access
    const docsResponse = await axios.get("http://localhost:3001/api/docs", {
      validateStatus: () => true, // Accept any status code
    });

    console.log(`📚 API Docs Status: ${docsResponse.status}`);

    return healthCheck;
  } catch (error) {
    console.log("❌ Backend connectivity test failed:", error.message);
    return false;
  }
}

async function testInvestmentEndpointsStructure() {
  console.log("\n🔍 Testing Investment API Endpoints Structure...");

  const endpoints = [
    {
      method: "GET",
      path: "/financial/investment/ai-recommendations",
      description: "AI Investment Recommendations",
    },
    {
      method: "POST",
      path: "/financial/investment/ai-analyze",
      description: "Portfolio Analysis",
    },
    {
      method: "GET",
      path: "/financial/investment/market-trends",
      description: "Market Trends",
    },
  ];

  let passedEndpoints = 0;

  for (const endpoint of endpoints) {
    try {
      console.log(`\n  Testing ${endpoint.description}...`);

      const config = {
        method: endpoint.method.toLowerCase(),
        url: `${API_BASE_URL}${endpoint.path}`,
        validateStatus: () => true, // Accept any status code
        timeout: 5000,
      };

      if (endpoint.method === "POST") {
        config.data = { holdings: [] }; // Empty portfolio for testing
        config.headers = { "Content-Type": "application/json" };
      }

      const response = await axios(config);

      if (response.status === 401) {
        console.log(
          `  ⚠️ ${endpoint.description}: Requires authentication (401) - Endpoint exists`
        );
        passedEndpoints++;
      } else if (response.status < 500) {
        console.log(
          `  ✅ ${endpoint.description}: Endpoint accessible (${response.status})`
        );
        passedEndpoints++;
      } else {
        console.log(
          `  ❌ ${endpoint.description}: Server error (${response.status})`
        );
      }
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log(`  ❌ ${endpoint.description}: Connection refused`);
      } else {
        console.log(`  ❌ ${endpoint.description}: ${error.message}`);
      }
    }
  }

  console.log(
    `\n📊 Investment Endpoints Results: ${passedEndpoints}/${endpoints.length} accessible`
  );
  return passedEndpoints === endpoints.length;
}

async function testFrontendPages() {
  console.log("\n🌐 Testing Frontend Pages...");

  const pages = [
    { path: "/", description: "Home Page" },
    { path: "/investment-ai", description: "Investment AI Page" },
    { path: "/login", description: "Login Page" },
  ];

  let passedPages = 0;

  for (const page of pages) {
    try {
      const response = await axios.get(`http://localhost:3000${page.path}`, {
        timeout: 5000,
      });

      if (response.status === 200) {
        console.log(`  ✅ ${page.description}: Accessible`);
        passedPages++;
      } else {
        console.log(`  ⚠️ ${page.description}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${page.description}: ${error.message}`);
    }
  }

  console.log(
    `\n📊 Frontend Pages Results: ${passedPages}/${pages.length} accessible`
  );
  return passedPages === pages.length;
}

async function runBasicInfrastructureTest() {
  console.log("🏗️ Running Basic Infrastructure Test");
  console.log("=======================================\n");

  let totalTests = 0;
  let passedTests = 0;

  // Test 1: Backend Connectivity
  totalTests++;
  const backendOk = await testBackendConnectivity();
  if (backendOk) passedTests++;

  // Test 2: Investment API Endpoints
  totalTests++;
  const endpointsOk = await testInvestmentEndpointsStructure();
  if (endpointsOk) passedTests++;

  // Test 3: Frontend Pages
  totalTests++;
  const frontendOk = await testFrontendPages();
  if (frontendOk) passedTests++;

  // Summary
  console.log("\n📋 Infrastructure Test Summary");
  console.log("==============================");
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);

  if (passedTests === totalTests) {
    console.log("\n🎉 All infrastructure tests passed! System is ready!");
  } else {
    console.log(
      "\n⚠️  Some infrastructure issues detected. Please check the results above."
    );
  }

  console.log("\n🔗 System URLs:");
  console.log("   Frontend: http://localhost:3000");
  console.log("   Investment AI: http://localhost:3000/investment-ai");
  console.log("   Backend API: http://localhost:3001/api/v1");
  console.log("   API Documentation: http://localhost:3001/api/docs");
}

// Run the infrastructure test
runBasicInfrastructureTest().catch(console.error);
