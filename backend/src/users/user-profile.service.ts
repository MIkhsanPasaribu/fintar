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
      };
    }

    return {
      ...user.profile,
      email: user.email,
      username: user.username,
    };
  }

  async updateProfile(userId: string, data: any) {
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return this.prisma.userProfile.update({
        where: { userId },
        data,
      });
    } else {
      return this.prisma.userProfile.create({
        data: {
          userId,
          ...data,
        },
      });
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
