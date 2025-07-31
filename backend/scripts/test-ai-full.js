const axios = require("axios");

async function fullTest() {
  console.log("🚀 Full AI Navigator Test");
  console.log("==========================");

  const BASE_URL = "http://localhost:3001/api/v1";

  // Step 1: Register new user
  console.log("\n1️⃣ Registering new user...");
  const newUser = {
    email: `test${Date.now()}@fintar.id`,
    password: "TestPassword123",
  };

  try {
    const registerResponse = await axios.post(
      `${BASE_URL}/auth/register`,
      newUser
    );
    console.log("✅ Registration successful");

    const token = registerResponse.data.accessToken;
    const headers = { Authorization: `Bearer ${token}` };

    console.log("   User ID:", registerResponse.data.user.id);
    console.log("   Username:", registerResponse.data.user.username);
    console.log("   Token preview:", token.substring(0, 30) + "...");

    // Step 2: Test AI Financial Insights
    console.log("\n2️⃣ Testing AI Financial Insights...");
    try {
      const insights = await axios.get(`${BASE_URL}/financial/ai-insights`, {
        headers,
      });
      console.log("✅ AI Insights Success:", insights.status);
      console.log("   Response:", insights.data);
    } catch (error) {
      console.log(
        "❌ AI Insights failed:",
        error.response?.status,
        error.response?.data
      );
    }

    // Step 3: Test AI Financial Plan
    console.log("\n3️⃣ Testing AI Financial Plan...");
    try {
      const plan = await axios.post(
        `${BASE_URL}/financial/ai-plan`,
        {
          duration: "1_year",
          goals: ["saving", "investment"],
        },
        { headers }
      );
      console.log("✅ AI Plan Success:", plan.status);
      console.log("   Response:", plan.data);
    } catch (error) {
      console.log(
        "❌ AI Plan failed:",
        error.response?.status,
        error.response?.data
      );
    }

    // Step 4: Test Budget Recommendations
    console.log("\n4️⃣ Testing Budget Recommendations...");
    try {
      const budget = await axios.get(
        `${BASE_URL}/financial/budget/ai-recommendations`,
        { headers }
      );
      console.log("✅ Budget Recommendations Success:", budget.status);
      console.log("   Response:", budget.data);
    } catch (error) {
      console.log(
        "❌ Budget Recommendations failed:",
        error.response?.status,
        error.response?.data
      );
    }

    // Step 5: Test Investment Recommendations
    console.log("\n5️⃣ Testing Investment Recommendations...");
    try {
      const investment = await axios.get(
        `${BASE_URL}/financial/investment/recommendations`,
        { headers }
      );
      console.log("✅ Investment Recommendations Success:", investment.status);
      console.log("   Response:", investment.data);
    } catch (error) {
      console.log(
        "❌ Investment Recommendations failed:",
        error.response?.status,
        error.response?.data
      );
    }

    // Step 6: Test Chat Session
    console.log("\n6️⃣ Testing Chat Session...");
    try {
      const session = await axios.post(
        `${BASE_URL}/chat/sessions`,
        {
          title: "AI Test Session",
          type: "financial_planning",
          metadata: { test: true },
        },
        { headers }
      );
      console.log("✅ Chat Session Created:", session.status);
      console.log("   Session ID:", session.data.id);

      // Step 7: Send Chat Message
      if (session.data.id) {
        console.log("\n7️⃣ Testing Chat Message...");
        try {
          const message = await axios.post(
            `${BASE_URL}/chat/sessions/${session.data.id}/messages`,
            {
              content:
                "Tolong berikan analisis keuangan saya dan rekomendasi investasi.",
            },
            { headers }
          );
          console.log("✅ Chat Message Success:", message.status);
          console.log("   AI Response:", message.data);
        } catch (error) {
          console.log(
            "❌ Chat Message failed:",
            error.response?.status,
            error.response?.data
          );
        }

        // Step 8: Get Chat History
        console.log("\n8️⃣ Testing Chat History...");
        try {
          const history = await axios.get(
            `${BASE_URL}/chat/sessions/${session.data.id}/messages`,
            { headers }
          );
          console.log("✅ Chat History Success:", history.status);
          console.log(
            "   Messages count:",
            Array.isArray(history.data) ? history.data.length : "Not array"
          );
        } catch (error) {
          console.log(
            "❌ Chat History failed:",
            error.response?.status,
            error.response?.data
          );
        }
      }
    } catch (error) {
      console.log(
        "❌ Chat Session failed:",
        error.response?.status,
        error.response?.data
      );
    }

    console.log("\n🎉 AI Navigator Test Complete!");
    console.log("===============================");
  } catch (error) {
    console.log(
      "❌ Registration failed:",
      error.response?.data || error.message
    );
  }
}

fullTest();
