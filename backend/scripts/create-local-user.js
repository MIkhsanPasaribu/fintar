const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function createLocalUserForSupabase() {
  try {
    console.log("🔍 Creating local user record for Supabase user...");

    const supabaseUserId = "89670439-6b7d-4694-9fc2-ee3973a11c39";
    const userData = {
      id: supabaseUserId, // Use Supabase ID as local ID
      email: "fintargemastik@gmail.com",
      username: "fintargemastik",
      firstName: "Fintar",
      lastName: "Gemastik",
      password: "$2b$10$placeholder", // Placeholder since we use Supabase auth
      supabaseId: supabaseUserId,
      onboardingCompleted: false,
      profileCompleted: false,
      financialDataCompleted: false,
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: supabaseUserId },
    });

    if (existingUser) {
      console.log("✅ User already exists in local database");
      console.log("ID:", existingUser.id);
      console.log("Email:", existingUser.email);
      return existingUser;
    }

    // Create user
    const user = await prisma.user.create({
      data: userData,
    });

    console.log("✅ Local user created successfully:");
    console.log("ID:", user.id);
    console.log("Email:", user.email);
    console.log("Username:", user.username);
    console.log("Supabase ID:", user.supabaseId);

    return user;
  } catch (error) {
    console.error("❌ Error creating local user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createLocalUserForSupabase();
