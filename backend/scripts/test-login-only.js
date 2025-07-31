const axios = require("axios");

async function testLogin() {
  try {
    console.log("🔐 Testing login with test@fintar.com...");

    const response = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: "test@fintar.com",
        password: "testpassword123",
      }
    );

    console.log("✅ Login successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    console.log("Access token:", response.data.access_token);

    return response.data.access_token;
  } catch (error) {
    console.error("❌ Login failed!");
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Full error:", error.message);
    return null;
  }
}

testLogin();
