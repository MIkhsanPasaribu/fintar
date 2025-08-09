const axios = require("axios");

async function debugJWT() {
  try {
    console.log("🔧 Debugging JWT...");

    // Step 1: Login
    console.log("\n1. 🔐 Logging in...");
    const loginResponse = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: "fintargemastik@gmail.com",
        password: "Testing123",
      }
    );

    const token = loginResponse.data.accessToken;
    console.log("✅ Login successful");
    console.log(
      "📊 Full login response:",
      JSON.stringify(loginResponse.data, null, 2)
    );

    if (!token) {
      console.error("❌ No access token received!");
      return;
    }

    console.log(`🔑 Token: ${token.substring(0, 50)}...`);

    // Step 2: Test profile endpoint with detailed headers
    console.log("\n2. 📋 Testing profile endpoint...");

    try {
      const profileResponse = await axios.get(
        "http://localhost:3001/api/v1/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Profile fetched successfully:");
      console.log(JSON.stringify(profileResponse.data, null, 2));
    } catch (error) {
      console.error("❌ Profile fetch failed:");
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data:`, error.response.data);
        console.error(`Headers:`, error.response.headers);
      } else {
        console.error(error.message);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

debugJWT();
