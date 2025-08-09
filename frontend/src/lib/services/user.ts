import { usersApi } from "../api";
import { UserProfile } from "../../types";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await usersApi.getUserProfile();
    return response.data as UserProfile;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await usersApi.updateUserProfile(data);
    return response.data as UserProfile;
  },

  async updateProfileFull(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await usersApi.updateUserProfileFull(data);
    return response.data as UserProfile;
  },

  async createProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await usersApi.createProfile(data);
    return response.data as UserProfile;
  },

  async getCurrentUser(): Promise<UserProfile> {
    const response = await usersApi.getCurrentUser();
    return response.data as UserProfile;
  },
};
