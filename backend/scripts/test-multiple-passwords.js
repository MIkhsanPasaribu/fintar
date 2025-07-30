const axios = require("axios");
const bcrypt = require("bcrypt");

async function testLogin() {
  try {
    console.log("🔐 Testing login for fintargemastik@gmail.com...");

    // Test different passwords
    const passwords = [
      "fintargemastik123",
      "Testing123",
      "password123",
      "admin123",
    ];

    for (let password of passwords) {
      try {
        console.log(`\n🔑 Trying password: ${password}`);
        const response = await axios.post(
          "http://localhost:3001/api/v1/auth/login",
          {
            email: "fintargemastik@gmail.com",
            password: password,
          }
        );

        console.log("✅ Login successful!");
        console.log("User ID:", response.data.user.id);
        console.log(
          "Token:",
          response.data.access_token ? "Present" : "Missing"
        );

        // If successful, break the loop
        return {
          success: true,
          token: response.data.access_token,
          userId: response.data.user.id,
        };
      } catch (error) {
        console.log(`❌ Failed with password: ${password}`);
        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Error:", error.response.data.message);
        }
      }
    }

    console.log("\n❌ All password attempts failed");
    return { success: false };
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    return { success: false };
  }
}

testLogin();
