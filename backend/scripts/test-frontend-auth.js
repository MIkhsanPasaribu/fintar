/**
 * Frontend Authentication Test Script
 * Copy and paste this into the browser console on http://localhost:3000
 */

console.log("🔍 Checking Frontend Authentication Status...");

// 1. Check localStorage auth data
const authToken = localStorage.getItem("auth_token");
const userInfo = localStorage.getItem("user_info");

console.log("Auth Token exists:", !!authToken);
if (authToken) {
  console.log("Token preview:", authToken.substring(0, 50) + "...");

  // Try to decode JWT payload (basic check)
  try {
    const tokenParts = authToken.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log("Token payload:", payload);
      console.log("Token expires:", new Date(payload.exp * 1000));
      console.log("Token valid:", new Date() < new Date(payload.exp * 1000));
    }
  } catch (e) {
    console.log("Could not decode token:", e.message);
  }
}

console.log("User Info exists:", !!userInfo);
if (userInfo) {
  try {
    const user = JSON.parse(userInfo);
    console.log("User data:", user);
  } catch (e) {
    console.log("Could not parse user info:", e.message);
  }
}

// 2. Test direct API call to chat sessions
if (authToken) {
  console.log("\n🧪 Testing direct API call...");

  fetch("http://localhost:3001/api/v1/chat/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      title: "Browser Console Test Session",
      type: "financial_planning",
      metadata: {
        createdAt: new Date().toISOString(),
        source: "browser_console",
      },
    }),
  })
    .then((response) => {
      console.log("Direct API Response Status:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("Direct API Response Data:", data);
      if (data.id) {
        console.log("✅ Session created successfully! ID:", data.id);
      } else {
        console.log("❌ Session creation failed or no ID returned");
      }
    })
    .catch((error) => {
      console.error("Direct API Error:", error);
    });
} else {
  console.log("❌ No auth token found - user needs to log in");
}
