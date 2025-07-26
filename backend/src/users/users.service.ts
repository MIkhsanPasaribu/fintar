import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { SupabaseService } from "../common/supabase/supabase.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { PartialType } from "@nestjs/mapped-types";
import * as bcrypt from "bcrypt";

export class UpdateUserDto extends PartialType(CreateUserDto) {}

@Injectable()
export class UsersService {
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
          const errorMsg = error instanceof Error ? error.message : String(error);
          const supabaseErrorMsg = supabaseError instanceof Error ? supabaseError.message : String(supabaseError);
          throw new Error(
            `Both primary database and Supabase failed: ${errorMsg}, ${supabaseErrorMsg}`
          );
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
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("users")
          .select("*");
        if (supabaseError) throw supabaseError;
        return data;
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
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("users")
          .select("*")
          .eq("id", id)
          .single();
        if (supabaseError) throw supabaseError;
        return data;
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
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("users")
          .select("*")
          .eq("email", email)
          .single();
        if (supabaseError && supabaseError.code !== "PGRST116") {
          throw supabaseError;
        }
        return data;
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

      const user = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
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
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("users")
          .update(updateUserDto)
          .eq("id", id)
          .select()
          .single();
        if (supabaseError) throw supabaseError;
        return data;
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
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("users")
          .delete()
          .eq("id", id);
        if (supabaseError) throw supabaseError;
        return data;
      }
      throw error;
    }
  }

  // User profile and settings
  async getUserProfile(userId: string) {
    try {
      const profile = await this.prismaService.userProfile.findUnique({
        where: { userId },
      });
      return profile;
    } catch (error) {
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (supabaseError) throw supabaseError;
        return data;
      }
      throw error;
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
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("user_profiles")
          .upsert({
            user_id: userId,
            ...profileData,
          })
          .select()
          .single();
        if (supabaseError) throw supabaseError;
        return data;
      }
      throw error;
    }
  }

  // User preferences
  async getUserPreferences(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { preferences: true },
      });
      return user?.preferences || {};
    } catch (error) {
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("user_preferences")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (supabaseError) throw supabaseError;
        return data;
      }
      throw error;
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
      // Fallback to Supabase
      if (this.supabaseService.isSupabaseAvailable()) {
        const { data, error: supabaseError } = await this.supabaseService
          .from("user_preferences")
          .upsert({
            user_id: userId,
            ...preferences,
          })
          .select()
          .single();
        if (supabaseError) throw supabaseError;
        return data;
      }
      throw error;
    }
  }
}
