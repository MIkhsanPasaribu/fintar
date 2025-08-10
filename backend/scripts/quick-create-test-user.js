const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@fintar.com" },
    });

    if (existingUser) {
      console.log("Test user already exists:", existingUser.email);
      return existingUser;
    }

    const hashedPassword = await bcrypt.hash("test123", 10);

    const user = await prisma.user.create({
      data: {
        email: "test@fintar.com",
        password: hashedPassword,
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        onboardingCompleted: true,
        profileCompleted: true,
        financialDataCompleted: true,
      },
    });

    console.log("Created test user:", user.email);
    return user;
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
