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
import {
  PersonalInfoDto,
  FinancialInfoDto,
  OnboardingStatusResponseDto,
} from "./dto/onboarding.dto";

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
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      console.log("[DEBUG] Looking for profile for userId:", userId);

      const profile = await this.prisma.userProfile.findUnique({
        where: { userId },
      });

      console.log("[DEBUG] Profile found:", !!profile);
      console.log("[DEBUG] Profile data:", profile);

      return profile;
    } catch (error) {
      console.error("[ERROR] getProfile failed:", error);
      throw error;
    }
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

  async getOnboardingStatus(
    userId: string
  ): Promise<OnboardingStatusResponseDto> {
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

  async submitPersonalInfo(userId: string, personalInfoDto: PersonalInfoDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Create or update profile with personal info
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...personalInfoDto,
        dateOfBirth: personalInfoDto.dateOfBirth
          ? new Date(personalInfoDto.dateOfBirth)
          : undefined,
      },
      create: {
        user: {
          connect: { id: userId },
        },
        ...personalInfoDto,
        dateOfBirth: personalInfoDto.dateOfBirth
          ? new Date(personalInfoDto.dateOfBirth)
          : undefined,
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

  async submitFinancialInfo(
    userId: string,
    financialInfoDto: FinancialInfoDto
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Update profile with financial info
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        monthlyIncome: financialInfoDto.monthlyIncome,
        monthlyExpenses: financialInfoDto.monthlyExpenses,
        currentSavings: financialInfoDto.currentSavings,
        currentDebt: financialInfoDto.currentDebt,
        emergencyFundAmount: financialInfoDto.emergencyFundAmount,
        financialGoals: financialInfoDto.financialGoals,
        riskTolerance: financialInfoDto.riskTolerance,
        investmentExperience: financialInfoDto.investmentExperience,
      },
      create: {
        user: {
          connect: { id: userId },
        },
        monthlyIncome: financialInfoDto.monthlyIncome,
        monthlyExpenses: financialInfoDto.monthlyExpenses,
        currentSavings: financialInfoDto.currentSavings,
        currentDebt: financialInfoDto.currentDebt,
        emergencyFundAmount: financialInfoDto.emergencyFundAmount,
        financialGoals: financialInfoDto.financialGoals,
        riskTolerance: financialInfoDto.riskTolerance,
        investmentExperience: financialInfoDto.investmentExperience,
      },
    });

    // Update user's financial data completion status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        financialDataCompleted: true,
        onboardingCompleted: this.checkOnboardingCompletion(
          user.profileCompleted || false,
          true
        ),
      },
    });

    return profile;
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
