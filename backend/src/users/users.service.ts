import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { SupabaseService } from "../common/supabase/supabase.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { PartialType } from "@nestjs/mapped-types";
import * as bcrypt from "bcrypt";

export class UpdateUserDto extends PartialType(CreateUserDto) {}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Try Prisma first (primary database)
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error("Primary database creation failed:", error);

      // Check if it's a permission error
      if (
        error instanceof Error &&
        error.message.includes("permission denied")
      ) {
        this.logger.warn(
          "Database permission denied, using Supabase fallback for user creation"
        );

        // Fallback to Supabase if available and primary database fails
        if (this.supabaseService.isSupabaseAvailable()) {
          try {
            const { data, error: supabaseError } = await this.supabaseService
              .from("users")
              .insert([
                {
                  ...createUserDto,
                  // Don't store plain password in Supabase fallback
                  password: await bcrypt.hash(createUserDto.password, 10),
                },
              ])
              .select()
              .single();
            if (supabaseError) throw supabaseError;
            const { password, ...userWithoutPassword } = data;
            return userWithoutPassword;
          } catch (supabaseError) {
            const errorMsg =
              error instanceof Error ? error.message : String(error);
            const supabaseErrorMsg =
              supabaseError instanceof Error
                ? supabaseError.message
                : String(supabaseError);
            throw new Error(
              `Both primary database and Supabase failed: ${errorMsg}, ${supabaseErrorMsg}`
            );
          }
        }
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.prismaService.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          isVerified: true,
          role: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      this.logger.error("Primary database findAll failed:", error);

      // Fallback to Supabase only for permission errors
      if (
        error instanceof Error &&
        error.message.includes("permission denied") &&
        this.supabaseService.isSupabaseAvailable()
      ) {
        try {
          const { data, error: supabaseError } = await this.supabaseService
            .from("users")
            .select("*");
          if (supabaseError) throw supabaseError;
          return data;
        } catch (supabaseError) {
          this.logger.error("Supabase fallback also failed:", supabaseError);
        }
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          isVerified: true,
          role: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      this.logger.error("Primary database findOne failed:", error);

      // Fallback to Supabase only for permission errors
      if (
        error instanceof Error &&
        error.message.includes("permission denied") &&
        this.supabaseService.isSupabaseAvailable()
      ) {
        try {
          const { data, error: supabaseError } = await this.supabaseService
            .from("users")
            .select("*")
            .eq("id", id)
            .single();
          if (supabaseError) throw supabaseError;
          return data;
        } catch (supabaseError) {
          this.logger.error("Supabase fallback also failed:", supabaseError);
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      this.logger.error("Primary database findByEmail failed:", error);

      // Fallback to Supabase only for permission errors
      if (
        error instanceof Error &&
        error.message.includes("permission denied") &&
        this.supabaseService.isSupabaseAvailable()
      ) {
        try {
          const { data, error: supabaseError } = await this.supabaseService
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
          if (supabaseError && supabaseError.code !== "PGRST116") {
            throw supabaseError;
          }
          return data;
        } catch (supabaseError) {
          this.logger.error("Supabase fallback also failed:", supabaseError);
        }
      }
      throw error;
    }
  }

  async findBySupabaseId(supabaseId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { supabaseId },
      });
      return user;
    } catch (error) {
      this.logger.error("Primary database findBySupabaseId failed:", error);

      // Fallback to Supabase only for permission errors
      if (
        error instanceof Error &&
        error.message.includes("permission denied") &&
        this.supabaseService.isSupabaseAvailable()
      ) {
        try {
          const { data, error: supabaseError } = await this.supabaseService
            .from("users")
            .select("*")
            .eq("supabaseId", supabaseId)
            .single();
          if (supabaseError && supabaseError.code !== "PGRST116") {
            throw supabaseError;
          }
          return data;
        } catch (supabaseError) {
          this.logger.error("Supabase fallback also failed:", supabaseError);
        }
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Hash password if it's being updated
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      // Hanya field milik model user yang boleh diupdate di sini
      const allowedFields = [
        "email",
        "username",
        "firstName",
        "lastName",
        "phone",
        "avatar",
        "isVerified",
        "role",
        "preferences",
        "password",
      ];
      const filteredDto: any = {};
      for (const key of allowedFields) {
        if (updateUserDto[key] !== undefined) {
          filteredDto[key] = updateUserDto[key];
        }
      }

      const user = await this.prismaService.user.update({
        where: { id },
        data: filteredDto,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          isVerified: true,
          role: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      this.logger.error("Primary database update failed:", error);

      // Fallback to Supabase only for permission errors
      if (
        error instanceof Error &&
        error.message.includes("permission denied") &&
        this.supabaseService.isSupabaseAvailable()
      ) {
        try {
          const { data, error: supabaseError } = await this.supabaseService
            .from("users")
            .update(updateUserDto)
            .eq("id", id)
            .select()
            .single();
          if (supabaseError) throw supabaseError;
          return data;
        } catch (supabaseError) {
          this.logger.error("Supabase fallback also failed:", supabaseError);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      this.logger.error("Primary database remove failed:", error);

      // Fallback to Supabase only for permission errors
      if (
        error instanceof Error &&
        error.message.includes("permission denied") &&
        this.supabaseService.isSupabaseAvailable()
      ) {
        try {
          const { data, error: supabaseError } = await this.supabaseService
            .from("users")
            .delete()
            .eq("id", id);
          if (supabaseError) throw supabaseError;
          return data;
        } catch (supabaseError) {
          this.logger.error("Supabase fallback also failed:", supabaseError);
        }
      }
      throw error;
    }
  }

  // User profile and settings - simplified error handling
  async getUserProfile(userId: string) {
    try {
      const profile = await this.prismaService.userProfile.findUnique({
        where: { userId },
      });
      return profile;
    } catch (error) {
      this.logger.error("getUserProfile failed:", error);
      // For now, just return null if database is unavailable
      return null;
    }
  }

  async updateUserProfile(userId: string, profileData: any) {
    try {
      const profile = await this.prismaService.userProfile.upsert({
        where: { userId },
        update: profileData,
        create: {
          userId,
          ...profileData,
        },
      });
      return profile;
    } catch (error) {
      this.logger.error("updateUserProfile failed:", error);
      throw new Error("Profile update unavailable due to database issues");
    }
  }

  // User preferences - simplified error handling
  async getUserPreferences(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { preferences: true },
      });
      return user?.preferences || {};
    } catch (error) {
      this.logger.error("getUserPreferences failed:", error);
      return {};
    }
  }

  async updateUserPreferences(userId: string, preferences: any) {
    try {
      const user = await this.prismaService.user.update({
        where: { id: userId },
        data: { preferences },
        select: { preferences: true },
      });
      return user.preferences;
    } catch (error) {
      this.logger.error("updateUserPreferences failed:", error);
      throw new Error("Preferences update unavailable due to database issues");
    }
  }
}
