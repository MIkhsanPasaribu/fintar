const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function resetPassword() {
  const prisma = new PrismaClient();

  try {
    const email = "mikhsanpasaribu2@gmail.com";
    const newPassword = "Testing123";

    console.log(`🔐 Resetting password for: ${email}`);
    console.log(`🔑 New password: ${newPassword}`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`🔐 Generated hash: ${hashedPassword.substring(0, 20)}...`);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        updatedAt: true,
      },
    });

    console.log("✅ Password updated successfully!");
    console.log(`👤 User: ${updatedUser.firstName} (${updatedUser.email})`);
    console.log(`⏰ Updated at: ${updatedUser.updatedAt}`);

    // Test the new password
    console.log("\n🧪 Testing new password...");
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { password: true },
    });

    const isValid = await bcrypt.compare(newPassword, user.password);
    console.log(`✅ Password test result: ${isValid}`);

    if (isValid) {
      console.log("\n🎉 Password reset successful! You can now login with:");
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${newPassword}`);
    } else {
      console.log("\n❌ Something went wrong with password reset");
    }
  } catch (error) {
    console.error("❌ Password reset failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
