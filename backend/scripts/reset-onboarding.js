const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function resetOnboardingStatus() {
  try {
    console.log("🔄 Resetting onboarding status for user...");

    const userId = "cmdpfvcpd00007kdgzvwxzen1";

    // Reset user onboarding status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: false,
        profileCompleted: false,
        financialDataCompleted: false,
      },
    });

    console.log("✅ User status reset:");
    console.log("- Onboarding Completed:", updatedUser.onboardingCompleted);
    console.log("- Profile Completed:", updatedUser.profileCompleted);
    console.log(
      "- Financial Data Completed:",
      updatedUser.financialDataCompleted
    );

    // Delete existing profile if any
    try {
      await prisma.userProfile.delete({
        where: { userId: userId },
      });
      console.log("✅ User profile deleted");
    } catch (error) {
      console.log("ℹ️ No existing profile to delete");
    }

    // Delete existing financial data if any
    try {
      const deletedFinancialData = await prisma.financialData.deleteMany({
        where: { userId: userId },
      });
      console.log(
        `✅ ${deletedFinancialData.count} financial data records deleted`
      );
    } catch (error) {
      console.log("ℹ️ No existing financial data to delete");
    }

    console.log("\n🎯 User is ready for fresh onboarding test!");
  } catch (error) {
    console.error("❌ Error resetting onboarding status:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetOnboardingStatus();
