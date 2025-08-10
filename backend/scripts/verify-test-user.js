const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function verifyTestUser() {
  try {
    const user = await prisma.user.update({
      where: { email: "test@fintar.com" },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    console.log("✅ Test user verified successfully:", user.email);
    console.log("✅ Email verified:", user.emailVerified);
    return user;
  } catch (error) {
    console.error("Error verifying test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTestUser();
