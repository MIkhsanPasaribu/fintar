// Debug session creation response format
console.log("🔍 DEBUGGING SESSION CREATION RESPONSE FORMAT");

async function debugSessionCreation() {
  try {
    // Test what the actual response looks like from session creation
    console.log("1️⃣ Testing direct backend call...");

    const testResponse = await fetch("http://localhost:3001/chat/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWRyZnNnNmEwMDAzN2t5ODRjdHNlamw4IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzIyNDMwNTQ5LCJleHAiOjE3MjI0MzQxNDl9.something", // Example token
      },
      body: JSON.stringify({
        title: "Debug Test Session",
        type: "financial_planning",
        metadata: {
          createdAt: new Date().toISOString(),
          userId: "test-user-id",
        },
      }),
    });

    console.log("Response status:", testResponse.status);
    console.log(
      "Response headers:",
      Object.fromEntries(testResponse.headers.entries())
    );

    const responseData = await testResponse.json();
    console.log(
      "Response data structure:",
      JSON.stringify(responseData, null, 2)
    );

    // Check what fields are available
    console.log("Available fields:");
    console.log("- response.data:", responseData);
    console.log("- response.id:", responseData.id);
    console.log("- response.sessionId:", responseData.sessionId);
    console.log("- response.data?.id:", responseData.data?.id);

    if (responseData.id) {
      console.log("✅ Session ID found at: responseData.id");
    } else if (responseData.sessionId) {
      console.log("✅ Session ID found at: responseData.sessionId");
    } else if (responseData.data?.id) {
      console.log("✅ Session ID found at: responseData.data.id");
    } else {
      console.log("❌ Session ID not found in expected locations");
      console.log("Full response:", responseData);
    }
  } catch (error) {
    console.log("❌ Error during debug:", error.message);
  }
}

debugSessionCreation();
