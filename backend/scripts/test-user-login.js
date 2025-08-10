// Test login with the new user to see the exact error

async function testUserLogin() {
  console.log("🚀 Testing user login...");

  const baseUrl = "http://localhost:3001";
  const testEmail = "verified-test@fintar.com";
  const testPassword = "test123456";

  try {
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok) {
      console.log("✅ Login successful!", loginData);
      return loginData;
    } else {
      console.log("❌ Login failed:", loginData.message);
      console.log("Full response:", loginData);

      // Check if it's an email verification issue
      if (
        loginData.message &&
        loginData.message.includes("belum diverifikasi")
      ) {
        console.log("");
        console.log("🔍 Email verification required.");
        console.log("Let me check if there are any verification endpoints...");

        // Try to resend verification
        const resendResponse = await fetch(
          `${baseUrl}/api/v1/auth/resend-verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: testEmail,
            }),
          }
        );

        const resendData = await resendResponse.json();

        if (resendResponse.ok) {
          console.log("✅ Verification email resent:", resendData.message);
          console.log("📧 Check your email for verification link.");
        } else {
          console.log("❌ Failed to resend verification:", resendData.message);
        }
      }

      return loginData;
    }
  } catch (error) {
    console.error("❌ Login test failed:", error.message);
    return { error: error.message };
  }
}

// Run the test
testUserLogin();
