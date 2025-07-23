import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { SupabaseService } from "../common/supabase/supabase.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateUserDto extends PartialType(CreateUserDto) {}

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { data, error } = await this.supabaseService
      .from("users")
      .insert([createUserDto])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .from("users")
      .select("*");
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async findByEmail(email: string) {
    const { data, error } = await this.supabaseService
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { data, error } = await this.supabaseService
      .from("users")
      .update(updateUserDto)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService
      .from("users")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return data;
  }

  // User profile and settings
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabaseService
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, profileData: any) {
    const { data, error } = await this.supabaseService
      .from("user_profiles")
      .upsert({
        user_id: userId,
        ...profileData,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // User preferences
  async getUserPreferences(userId: string) {
    const { data, error } = await this.supabaseService
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  }

  async updateUserPreferences(userId: string, preferences: any) {
    const { data, error } = await this.supabaseService
      .from("user_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
