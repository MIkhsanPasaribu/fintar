const axios = require("axios");

async function testGetProfile() {
  try {
    const login = await axios.post("http://localhost:3001/api/v1/auth/login", {
      email: "fintargemastik@gmail.com",
      password: "Testing123",
    });

    const headers = {
      Authorization: `Bearer ${login.data.access_token}`,
    };

    const profile = await axios.get(
      "http://localhost:3001/api/v1/users/profile",
      { headers }
    );
    console.log("Profile response:", JSON.stringify(profile.data, null, 2));
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testGetProfile();
