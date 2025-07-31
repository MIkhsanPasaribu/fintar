import { usersApi } from "../api";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  occupation?: string;
  company?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  currentSavings?: number;
  riskTolerance?: string;
  financialGoals?: string[];
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await usersApi.getUserProfile();
    return response.data as UserProfile;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await usersApi.updateUserProfile(data);
    return response.data as UserProfile;
  },

  async getCurrentUser(): Promise<UserProfile> {
    const response = await usersApi.getCurrentUser();
    return response.data as UserProfile;
  },
};
