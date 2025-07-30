const axios = require("axios");

async function testLogin() {
  try {
    console.log("🔐 Testing login API...");

    const loginData = {
      email: "mikhsanpasaribu2@gmail.com",
      password: "Testing123",
    };

    console.log(`📧 Email: ${loginData.email}`);
    console.log(`🔑 Password: ${loginData.password}`);

    const response = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("\n✅ Login successful!");
    console.log("📊 Response status:", response.status);
    console.log("🎫 Response data:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("\n❌ Login failed!");

    if (error.response) {
      console.error("📊 Status:", error.response.status);
      console.error("📄 Response data:");
      console.error(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("🌐 No response received from server");
      console.error("Request:", error.request);
    } else {
      console.error("⚙️ Error setting up request:", error.message);
    }
  }
}

testLogin();
