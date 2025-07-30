const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function checkUser() {
  try {
    console.log("🔍 Checking if user exists...");

    // Check by email
    const user = await prisma.user.findUnique({
      where: { email: "fintargemastik@gmail.com" },
      include: {
        profile: true,
        financialData: true,
      },
    });

    if (user) {
      console.log("✅ User found:");
      console.log("ID:", user.id);
      console.log("Email:", user.email);
      console.log("Username:", user.username);
      console.log("Onboarding Completed:", user.onboardingCompleted);
      console.log("Profile Completed:", user.profileCompleted);
      console.log("Financial Data Completed:", user.financialDataCompleted);
      console.log("Has Profile:", !!user.profile);
      console.log(
        "Has Financial Data:",
        user.financialData && user.financialData.length > 0
      );
    } else {
      console.log("❌ User not found");

      // Let's check all users
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });

      console.log("📋 All users in database:");
      allUsers.forEach((user, index) => {
        console.log(
          `${index + 1}. ID: ${user.id}, Email: ${user.email}, Username: ${user.username}, Created: ${user.createdAt}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error checking user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
