import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
import { UserProfile } from "@/types";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  profileCompleted?: boolean;
  financialDataCompleted?: boolean;
  profile?: {
    age?: number;
    income?: number;
    riskTolerance?: "low" | "medium" | "high";
    financialGoals?: string[];
    currentSavings?: number;
    monthlyExpenses?: number;
    dateOfBirth?: string;
    gender?: string;
    occupation?: string;
    company?: string;
    currentDebt?: number;
    emergencyFundAmount?: number;
    investmentExperience?: string;
    currentInvestments?: string;
    maritalStatus?: string;
    dependents?: number;
    educationLevel?: string;
    assets?: string;
    liabilities?: string;
    insurance?: string;
    address?: string;
    currency?: string;
  };
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          // Get user profile from API
          const userProfileResponse = await usersApi
            .getUserProfile()
            .catch(() => null);
          const userProfileData = userProfileResponse as UserProfile | null;

          if (userProfileData) {
            // Create user object with real data from database only
            const currentUser: User = {
              id: userProfileData.id || `user_${Date.now()}`,
              email: userProfileData.email || "",
              name:
                userProfileData.firstName || userProfileData.username || "User",
              firstName: userProfileData.firstName || "",
              lastName: userProfileData.lastName || "",
              profileCompleted: !!(
                userProfileData.firstName &&
                userProfileData.lastName &&
                userProfileData.dateOfBirth &&
                userProfileData.occupation
              ),
              financialDataCompleted: !!(
                userProfileData.monthlyIncome &&
                userProfileData.monthlyExpenses &&
                userProfileData.currentSavings &&
                userProfileData.riskTolerance
              ),
              profile: {
                age: userProfileData?.dateOfBirth
                  ? Math.floor(
                      (Date.now() -
                        new Date(userProfileData.dateOfBirth).getTime()) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )
                  : undefined,
                income: userProfileData?.monthlyIncome || undefined,
                riskTolerance:
                  (userProfileData?.riskTolerance?.toLowerCase() as
                    | "low"
                    | "medium"
                    | "high") || undefined,
                financialGoals: userProfileData?.financialGoals || [],
                currentSavings: userProfileData?.currentSavings || undefined,
                monthlyExpenses: userProfileData?.monthlyExpenses || undefined,
                dateOfBirth: userProfileData?.dateOfBirth || undefined,
                gender: userProfileData?.gender || undefined,
                occupation: userProfileData?.occupation || undefined,
                company: userProfileData?.company || undefined,
                currentDebt: userProfileData?.currentDebt || undefined,
                emergencyFundAmount:
                  userProfileData?.emergencyFundAmount || undefined,
                investmentExperience:
                  userProfileData?.investmentExperience || undefined,
                currentInvestments:
                  userProfileData?.currentInvestments || undefined,
                maritalStatus: userProfileData?.maritalStatus || undefined,
                dependents: userProfileData?.dependents || undefined,
                educationLevel: userProfileData?.educationLevel || undefined,
                assets: userProfileData?.assets || undefined,
                liabilities: userProfileData?.liabilities || undefined,
                insurance: userProfileData?.insurance || undefined,
                address: userProfileData?.address || undefined,
                currency: userProfileData?.currency || "IDR",
              },
            };
            setUser(currentUser);
          } else {
            // No profile data - user needs to complete profile
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");

    // Reset user state
    setUser(null);
  };

  const updateUserProfile = (profileData: Partial<User["profile"]>) => {
    if (user) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          ...profileData,
        },
      });
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const userProfileResponse = await usersApi
          .getUserProfile()
          .catch(() => null);
        const userProfileData = userProfileResponse as UserProfile | null;

        if (userProfileData) {
          const updatedUser: User = {
            id: userProfileData.id || user?.id || `user_${Date.now()}`,
            email: userProfileData.email || user?.email || "",
            name:
              userProfileData.firstName ||
              userProfileData.username ||
              user?.name ||
              "User",
            firstName: userProfileData.firstName || user?.firstName || "",
            lastName: userProfileData.lastName || user?.lastName || "",
            profileCompleted: !!(
              userProfileData.firstName &&
              userProfileData.lastName &&
              userProfileData.dateOfBirth &&
              userProfileData.occupation
            ),
            financialDataCompleted: !!(
              userProfileData.monthlyIncome &&
              userProfileData.monthlyExpenses &&
              userProfileData.currentSavings &&
              userProfileData.riskTolerance
            ),
            profile: {
              age: userProfileData?.dateOfBirth
                ? Math.floor(
                    (Date.now() -
                      new Date(userProfileData.dateOfBirth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )
                : undefined,
              income: userProfileData?.monthlyIncome || undefined,
              riskTolerance:
                (userProfileData?.riskTolerance?.toLowerCase() as
                  | "low"
                  | "medium"
                  | "high") || undefined,
              financialGoals: userProfileData?.financialGoals || [],
              currentSavings: userProfileData?.currentSavings || undefined,
              monthlyExpenses: userProfileData?.monthlyExpenses || undefined,
              dateOfBirth: userProfileData?.dateOfBirth || undefined,
              gender: userProfileData?.gender || undefined,
              occupation: userProfileData?.occupation || undefined,
              company: userProfileData?.company || undefined,
              currentDebt: userProfileData?.currentDebt || undefined,
              emergencyFundAmount:
                userProfileData?.emergencyFundAmount || undefined,
              investmentExperience:
                userProfileData?.investmentExperience || undefined,
              currentInvestments:
                userProfileData?.currentInvestments || undefined,
              maritalStatus: userProfileData?.maritalStatus || undefined,
              dependents: userProfileData?.dependents || undefined,
              educationLevel: userProfileData?.educationLevel || undefined,
              assets: userProfileData?.assets || undefined,
              liabilities: userProfileData?.liabilities || undefined,
              insurance: userProfileData?.insurance || undefined,
              address: userProfileData?.address || undefined,
              currency: userProfileData?.currency || "IDR",
            },
          };
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    logout,
    updateUserProfile,
    refreshUser,
    isAuthenticated: !!user,
  };
};

export default useUser;
