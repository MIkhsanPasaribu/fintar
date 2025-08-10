// Create a verified test user via API endpoints

async function createVerifiedTestUser() {
  console.log("🚀 Creating verified test user via API...");

  const baseUrl = "http://localhost:3001";
  const testEmail = "verified-test@fintar.com";
  const testPassword = "test123456";

  try {
    // Step 1: Register a new user
    console.log("1. 📝 Registering new user...");
    const registerResponse = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: "Verified",
        lastName: "Test",
        username: "verifiedtest",
      }),
    });

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      if (
        errorData.message &&
        errorData.message.includes("User dengan email")
      ) {
        console.log("✅ User already exists, trying to login...");
        // Try to login directly
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

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log("✅ Existing user login successful!");
          return {
            email: testEmail,
            password: testPassword,
            token: loginData.accessToken,
            user: loginData.user,
          };
        } else {
          const loginError = await loginResponse.json();
          console.log("Login error:", loginError.message);
          if (
            loginError.message &&
            loginError.message.includes("belum diverifikasi")
          ) {
            console.log(
              "⚠️ User exists but not verified. This might be a previous test user."
            );
          }
        }
      } else {
        throw new Error(`Registration failed: ${errorData.message}`);
      }
    } else {
      const registerData = await registerResponse.json();
      console.log("✅ Registration successful!", {
        userId: registerData.user?.id,
        email: registerData.user?.email,
      });
    }

    // Since we can't automatically verify emails in this environment,
    // let's return the credentials for manual testing
    console.log("");
    console.log("🎯 Test User Created Successfully!");
    console.log("");
    console.log("📧 For frontend testing, use these credentials:");
    console.log("  Email:", testEmail);
    console.log("  Password:", testPassword);
    console.log("");
    console.log("⚠️ Note: If email verification is required, you may need to:");
    console.log(
      "  1. Check the verification email (if email service is configured)"
    );
    console.log("  2. Or manually verify the user in the database");
    console.log("  3. Or use an existing verified user for testing");
    console.log("");

    return {
      email: testEmail,
      password: testPassword,
      needsVerification: true,
    };
  } catch (error) {
    console.error("❌ Test user creation failed:", error.message);
    console.error("Full error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the function
createVerifiedTestUser();
