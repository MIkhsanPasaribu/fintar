const { PrismaClient } = require("@prisma/client");

async function checkUser() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Checking for user: mikhsanpasaribu2@gmail.com");

    const user = await prisma.user.findUnique({
      where: {
        email: "mikhsanpasaribu2@gmail.com",
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        // Don't select password for security
      },
    });

    if (user) {
      console.log("✅ User found in database:");
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log("❌ User not found in database");

      // Check all users
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          createdAt: true,
        },
      });

      console.log(`\n📊 Total users in database: ${allUsers.length}`);
      if (allUsers.length > 0) {
        console.log("👥 All users:");
        allUsers.forEach((u, index) => {
          console.log(
            `${index + 1}. ${u.email} (${u.username}) - Created: ${u.createdAt}`
          );
        });
      }
    }
  } catch (error) {
    console.error("❌ Database error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
