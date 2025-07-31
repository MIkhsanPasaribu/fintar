import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";

interface UserProfileData {
  id?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  monthlyIncome?: number;
  riskTolerance?: string;
  financialGoals?: string[];
  currentSavings?: number;
  monthlyExpenses?: number;
}

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
          const userProfileData = userProfileResponse as UserProfileData | null;

          if (userProfileData) {
            // Create user object with real data from database only
            const currentUser: User = {
              id: userProfileData.id || `user_${Date.now()}`,
              email: userProfileData.email || "",
              name: userProfileData.name || userProfileData.firstName || "User",
              firstName: userProfileData.firstName || "",
              lastName: userProfileData.lastName || "",
              profileCompleted: !!(
                userProfileData.firstName && userProfileData.lastName
              ),
              financialDataCompleted: !!(
                userProfileData.monthlyIncome && userProfileData.monthlyExpenses
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
    localStorage.removeItem("auth_token");
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
        const userProfileData = userProfileResponse as UserProfileData | null;

        if (userProfileData) {
          const updatedUser: User = {
            id: userProfileData.id || user?.id || `user_${Date.now()}`,
            email: userProfileData.email || user?.email || "",
            name:
              userProfileData.name ||
              userProfileData.firstName ||
              user?.name ||
              "User",
            firstName: userProfileData.firstName || user?.firstName || "",
            lastName: userProfileData.lastName || user?.lastName || "",
            profileCompleted: !!(
              userProfileData.firstName && userProfileData.lastName
            ),
            financialDataCompleted: !!(
              userProfileData.monthlyIncome && userProfileData.monthlyExpenses
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
