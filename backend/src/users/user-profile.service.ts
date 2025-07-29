import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import {
  CreateUserProfileDto,
  UpdateUserProfileDto,
  OnboardingStatusDto,
} from "./dto/user-profile.dto";

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, createProfileDto: CreateUserProfileDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if profile already exists
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException("User profile already exists");
    }

    // Create the profile
    const profile = await this.prisma.userProfile.create({
      data: {
        user: {
          connect: { id: userId },
        },
        ...createProfileDto,
      },
    });

    // Update user's profile completion status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        profileCompleted: true,
        onboardingCompleted: this.checkOnboardingCompletion(
          true,
          user.financialDataCompleted || false
        ),
      },
    });

    return profile;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateUserProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Update the profile
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...updateProfileDto,
      },
      create: {
        user: {
          connect: { id: userId },
        },
        ...updateProfileDto,
      },
    });

    // Update user's profile completion status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        profileCompleted: true,
        onboardingCompleted: this.checkOnboardingCompletion(
          true,
          user.financialDataCompleted || false
        ),
      },
    });

    return profile;
  }

  async deleteProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    await this.prisma.userProfile.delete({
      where: { userId },
    });

    // Update user's profile completion status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        profileCompleted: false,
      },
    });

    return { message: "Profile deleted successfully" };
  }

  async updateOnboardingStatus(
    userId: string,
    step: "profile" | "financial",
    completed: boolean
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updateData: any = {};

    if (step === "profile") {
      updateData.profileCompleted = completed;
      updateData.onboardingCompleted = this.checkOnboardingCompletion(
        completed,
        user.financialDataCompleted || false
      );
    } else if (step === "financial") {
      updateData.financialDataCompleted = completed;
      updateData.onboardingCompleted = this.checkOnboardingCompletion(
        user.profileCompleted || false,
        completed
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updatedUser;
  }

  async skipOnboarding(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
      },
    });

    return updatedUser;
  }

  async getOnboardingStatus(userId: string): Promise<OnboardingStatusDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        financialData: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const hasProfile = !!user.profile;
    const hasFinancialData =
      user.financialData && user.financialData.length > 0;

    return {
      onboardingCompleted: user.onboardingCompleted || false,
      profileCompleted: user.profileCompleted || false,
      financialDataCompleted: user.financialDataCompleted || false,
      hasProfile,
      hasFinancialData,
    };
  }

  private checkOnboardingCompletion(
    profileCompleted: boolean,
    financialDataCompleted: boolean
  ): boolean {
    return profileCompleted && financialDataCompleted;
  }

  async needsOnboarding(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return user ? !user.onboardingCompleted : true;
  }
}
