/**
 * Browser test script to debug AI chat session creation
 * Run this in the browser console on http://localhost:3000
 */

async function debugChatSession() {
  console.log("🔍 Debugging Chat Session Creation...");

  // 1. Check if user is logged in
  const token = localStorage.getItem("auth_token");
  console.log("Auth token exists:", !!token);
  if (token) {
    console.log("Token preview:", token.substring(0, 50) + "...");
  }

  // 2. Check stored user data
  const userInfo = localStorage.getItem("user_info");
  if (userInfo) {
    const user = JSON.parse(userInfo);
    console.log("User info:", user);
  } else {
    console.log("No user info in localStorage");
  }

  // 3. Test API endpoint directly
  try {
    console.log("Testing API endpoint directly...");
    const response = await fetch("http://localhost:3001/api/v1/chat/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Browser Test Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
        },
      }),
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok) {
      console.log("✅ Direct API call successful!");
      return data.id;
    } else {
      console.log("❌ Direct API call failed");
    }
  } catch (error) {
    console.error("Direct API call error:", error);
  }

  // 4. Test using the app's API client
  try {
    console.log("Testing using app API client...");

    // Import the api client if available
    if (window.apiClient) {
      const response = await window.apiClient.post("/api/v1/chat/sessions", {
        title: "App Client Test Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
        },
      });
      console.log("App client response:", response);
    } else {
      console.log("App API client not available on window");
    }
  } catch (error) {
    console.error("App API client error:", error);
  }
}

// Auto-run the debug function
debugChatSession();
