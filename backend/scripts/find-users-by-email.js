const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function findUsersByEmail() {
  try {
    console.log("🔍 Finding users with email fintargemastik@gmail.com...");

    // Find all users with this email
    const users = await prisma.user.findMany({
      where: {
        email: "fintargemastik@gmail.com",
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        supabaseId: true,
        onboardingCompleted: true,
        profileCompleted: true,
        financialDataCompleted: true,
        createdAt: true,
      },
    });

    console.log(`Found ${users.length} user(s):`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log("  ID:", user.id);
      console.log("  Email:", user.email);
      console.log("  Username:", user.username);
      console.log("  First Name:", user.firstName);
      console.log("  Last Name:", user.lastName);
      console.log("  Supabase ID:", user.supabaseId);
      console.log("  Onboarding Completed:", user.onboardingCompleted);
      console.log("  Profile Completed:", user.profileCompleted);
      console.log("  Financial Data Completed:", user.financialDataCompleted);
      console.log("  Created At:", user.createdAt);
    });

    // Check if any has the Supabase ID we need
    const supabaseUserId = "89670439-6b7d-4694-9fc2-ee3973a11c39";
    const userWithSupabaseId = users.find(
      (user) => user.id === supabaseUserId || user.supabaseId === supabaseUserId
    );

    if (userWithSupabaseId) {
      console.log(
        "\n✅ Found user with matching Supabase ID:",
        userWithSupabaseId.id
      );
    } else {
      console.log("\n❌ No user found with Supabase ID:", supabaseUserId);
    }
  } catch (error) {
    console.error("❌ Error finding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

findUsersByEmail();
