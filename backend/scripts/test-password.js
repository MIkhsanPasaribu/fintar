const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function testPassword() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Testing password for: mikhsanpasaribu2@gmail.com");

    const user = await prisma.user.findUnique({
      where: {
        email: "mikhsanpasaribu2@gmail.com",
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true, // We need this to test
        firstName: true,
      },
    });

    if (!user) {
      console.log("❌ User not found in database");
      return;
    }

    console.log("✅ User found in database");
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Username: ${user.username}`);
    console.log(`🏷️ Name: ${user.firstName}`);
    console.log(`🔐 Password hash length: ${user.password.length}`);

    // Test the password
    const testPassword = "Testing123";
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);

    console.log(`\n🧪 Testing password: "${testPassword}"`);
    console.log(`✅ Password match: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log("\n⚠️ Password does not match!");
      console.log("Let me check the hash...");

      // Let's try to create a new hash and compare
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log(`🔐 Original hash: ${user.password.substring(0, 20)}...`);
      console.log(`🔐 New hash:      ${newHash.substring(0, 20)}...`);

      // Test with common variations
      const variations = ["testing123", "TESTING123", "Testing123!"];
      for (const variation of variations) {
        const isMatch = await bcrypt.compare(variation, user.password);
        console.log(`🧪 Testing "${variation}": ${isMatch}`);
      }
    }
  } catch (error) {
    console.error("❌ Database error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();
