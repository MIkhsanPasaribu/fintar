const axios = require("axios");

async function testLogin() {
  try {
    console.log("🔧 Testing basic login...");

    const response = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: "fintargemastik@gmail.com",
        password: "Testing123",
      }
    );

    console.log("✅ Login successful!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("❌ Login failed:", error.response?.data || error.message);
  }
}

testLogin();
