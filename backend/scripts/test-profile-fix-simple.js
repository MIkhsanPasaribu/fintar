const axios = require("axios");

async function testProfileFix() {
  try {
    console.log("🔧 Testing Profile Update Fix...");

    // Step 1: Login
    console.log("\n1. 🔐 Logging in...");
    const loginResponse = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: "mikhsanpasaribu@gmail.com",
        password: "Ikhsan123",
      }
    );

    const token = loginResponse.data.access_token;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("✅ Login successful");

    // Step 2: Get current profile
    console.log("\n2. 📋 Getting current profile...");
    try {
      const profileResponse = await axios.get(
        "http://localhost:3001/api/v1/users/profile",
        { headers }
      );
      console.log("✅ Profile retrieved:", {
        firstName: profileResponse.data.firstName,
        lastName: profileResponse.data.lastName,
        email: profileResponse.data.email,
      });
    } catch (error) {
      console.log(
        "❌ Profile get failed:",
        error.response?.data || error.message
      );
    }

    // Step 3: Update profile using PUT
    console.log("\n3. ✏️ Updating profile using PUT...");
    const updateData = {
      firstName: "John",
      lastName: "Updated",
      phone: "+6281234567890",
      occupation: "Software Engineer",
      company: "Fintar Corp",
    };

    try {
      const updateResponse = await axios.put(
        "http://localhost:3001/api/v1/users/profile",
        updateData,
        { headers }
      );
      console.log("✅ Profile updated successfully:", updateResponse.data);
    } catch (error) {
      console.log(
        "❌ Profile update failed:",
        error.response?.data || error.message
      );
    }

    // Step 4: Get updated profile
    console.log("\n4. 📋 Getting updated profile...");
    try {
      const updatedProfileResponse = await axios.get(
        "http://localhost:3001/api/v1/users/profile",
        { headers }
      );
      console.log("✅ Updated profile:", {
        firstName: updatedProfileResponse.data.firstName,
        lastName: updatedProfileResponse.data.lastName,
        phone: updatedProfileResponse.data.phone,
        occupation: updatedProfileResponse.data.occupation,
      });
    } catch (error) {
      console.log(
        "❌ Updated profile get failed:",
        error.response?.data || error.message
      );
    }

    console.log("\n🎉 Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testProfileFix();
