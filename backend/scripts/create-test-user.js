/**
 * Create a local test user for AI chat integration testing
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function createTestUser() {
  try {
    console.log("🔍 Creating local test user for AI integration testing...");

    const email = "debug@fintar.id";
    const password = "DebugPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email: email,
      username: "debuguser",
      firstName: "Debug",
      lastName: "User",
      password: hashedPassword,
      isVerified: true, // Auto-verify for testing
      onboardingCompleted: true,
      profileCompleted: true,
      financialDataCompleted: true,
      role: "CLIENT",
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log("✅ Test user already exists in database");
      console.log("ID:", existingUser.id);
      console.log("Email:", existingUser.email);
      console.log("Username:", existingUser.username);
      return existingUser;
    }

    // Create user
    const user = await prisma.user.create({
      data: userData,
    });

    console.log("✅ Test user created successfully:");
    console.log("ID:", user.id);
    console.log("Email:", user.email);
    console.log("Username:", user.username);
    console.log("Password:", password);

    return user;
  } catch (error) {
    console.error("❌ Error creating test user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser()
  .then(() => {
    console.log("\n🎉 Test user setup complete!");
    console.log("You can now run AI integration tests with:");
    console.log("Email: debug@fintar.id");
    console.log("Password: DebugPassword123");
  })
  .catch((error) => {
    console.error("\n❌ Failed to create test user:", error);
    process.exit(1);
  });
