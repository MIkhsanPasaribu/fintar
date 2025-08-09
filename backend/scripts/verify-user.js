const { PrismaClient } = require("@prisma/client");

async function verifyUser() {
  const prisma = new PrismaClient();

  try {
    const email = "fintargemastik@gmail.com";

    console.log(`🔍 Checking verification status for: ${email}`);

    // Get current status
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        isVerified: true,
        emailVerificationToken: true,
        emailVerificationExpiry: true,
      },
    });

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log(`Current status: isVerified = ${user.isVerified}`);

    if (!user.isVerified) {
      console.log("🔧 Setting user as verified...");

      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiry: null,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          isVerified: true,
        },
      });

      console.log("✅ User verification updated:", updatedUser);
    } else {
      console.log("✅ User is already verified");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUser();
