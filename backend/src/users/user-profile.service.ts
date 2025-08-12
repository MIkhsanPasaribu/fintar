import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // If profile doesn't exist, create a minimal one
    if (!user.profile) {
      const newProfile = await this.prisma.userProfile.create({
        data: {
          userId,
        },
      });
      return {
        ...newProfile,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
      };
    }

    return {
      ...user.profile,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
    };
  }

  async updateProfile(userId: string, data: any) {
    try {
      console.log(`🔧 Updating profile for user ${userId}:`, data);

      // Remove fields that shouldn't be saved (compatibility fields)
      const { id, email, username, ...updateData } = data;

      // Separate user fields from profile fields
      const { firstName, lastName, phone, avatar, ...profileData } = updateData;
      const userFields = { firstName, lastName, phone, avatar };

      // Filter out undefined user fields
      const validUserFields = Object.fromEntries(
        Object.entries(userFields).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );

      // Filter out undefined profile fields
      const validProfileFields = Object.fromEntries(
        Object.entries(profileData).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );

      // Update User table if there are user-specific fields
      if (Object.keys(validUserFields).length > 0) {
        await this.prisma.user.update({
          where: { id: userId },
          data: validUserFields,
        });
        console.log("✅ User data updated successfully");
      }

      // Handle UserProfile update/create
      let updatedProfile = null;
      if (Object.keys(validProfileFields).length > 0) {
        // Convert dateOfBirth string to Date if present
        if (
          validProfileFields.dateOfBirth &&
          typeof validProfileFields.dateOfBirth === "string"
        ) {
          validProfileFields.dateOfBirth = new Date(
            validProfileFields.dateOfBirth + "T00:00:00.000Z"
          );
        }

        const existingProfile = await this.prisma.userProfile.findUnique({
          where: { userId },
        });

        if (existingProfile) {
          updatedProfile = await this.prisma.userProfile.update({
            where: { userId },
            data: validProfileFields,
          });
          console.log("✅ Profile updated successfully");
        } else {
          updatedProfile = await this.prisma.userProfile.create({
            data: {
              userId,
              ...validProfileFields,
            },
          });
          console.log("✅ Profile created successfully");
        }
      }

      // Get complete updated user data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Return combined user and profile data
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        ...(user.profile || {}),
      };
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      throw new Error(
        `Failed to update profile: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async completeOnboarding(userId: string) {
    // Update onboardingCompleted in User model, not UserProfile
    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });

    // Return or create user profile
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
      },
    });
  }

  async createProfile(userId: string, data: any) {
    return this.prisma.userProfile.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async createOrUpdateProfile(userId: string, data: any) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}
