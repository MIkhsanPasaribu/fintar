import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  onboardingCompleted?: boolean;
  profileCompleted?: boolean;
  financialDataCompleted?: boolean;
  profile?: {
    age?: number;
    income?: number;
    riskTolerance?: "low" | "medium" | "high";
    financialGoals?: string[];
    currentSavings?: number;
    monthlyExpenses?: number;
    onboardingCompleted?: boolean;
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
          // Get user data and onboarding status from API
          const [onboardingStatusResponse, userProfileResponse] =
            await Promise.allSettled([
              usersApi.getOnboardingStatus(),
              usersApi.getUserProfile().catch(() => null), // Don't fail if no profile
            ]);

          // Extract data from settled promises
          const onboardingStatus =
            onboardingStatusResponse.status === "fulfilled"
              ? onboardingStatusResponse.value
              : {
                  onboardingCompleted: false,
                  profileCompleted: false,
                  financialDataCompleted: false,
                };

          const userProfile =
            userProfileResponse.status === "fulfilled" &&
            userProfileResponse.value
              ? userProfileResponse.value
              : null;

          // Create user object with real data
          const currentUser: User = {
            id: `user_${Date.now()}`,
            email: "user@fintar.com",
            name: "Current User",
            firstName: "Current",
            lastName: "User",
            onboardingCompleted: onboardingStatus.onboardingCompleted,
            profileCompleted: onboardingStatus.profileCompleted,
            financialDataCompleted: onboardingStatus.financialDataCompleted,
            profile: {
              onboardingCompleted: onboardingStatus.onboardingCompleted,
              age: userProfile?.dateOfBirth
                ? Math.floor(
                    (Date.now() - new Date(userProfile.dateOfBirth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )
                : 28,
              income: userProfile?.monthlyIncome || 8500000,
              riskTolerance:
                userProfile?.riskTolerance?.toLowerCase() || "medium",
              financialGoals: userProfile?.financialGoals || [
                "Emergency Fund",
                "House Down Payment",
                "Retirement",
              ],
              currentSavings: userProfile?.currentSavings || 15000000,
              monthlyExpenses: userProfile?.monthlyExpenses || 6000000,
            },
          };
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
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
        const [onboardingStatusResponse, userProfileResponse] =
          await Promise.allSettled([
            usersApi.getOnboardingStatus(),
            usersApi.getUserProfile().catch(() => null),
          ]);

        const onboardingStatus =
          onboardingStatusResponse.status === "fulfilled"
            ? onboardingStatusResponse.value
            : {
                onboardingCompleted: false,
                profileCompleted: false,
                financialDataCompleted: false,
              };

        const userProfile =
          userProfileResponse.status === "fulfilled" &&
          userProfileResponse.value
            ? userProfileResponse.value
            : null;

        if (user) {
          setUser({
            ...user,
            onboardingCompleted: onboardingStatus.onboardingCompleted,
            profileCompleted: onboardingStatus.profileCompleted,
            financialDataCompleted: onboardingStatus.financialDataCompleted,
            profile: {
              ...user.profile,
              onboardingCompleted: onboardingStatus.onboardingCompleted,
              age: userProfile?.dateOfBirth
                ? Math.floor(
                    (Date.now() - new Date(userProfile.dateOfBirth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )
                : user.profile?.age || 28,
              income:
                userProfile?.monthlyIncome || user.profile?.income || 8500000,
              riskTolerance:
                userProfile?.riskTolerance?.toLowerCase() ||
                user.profile?.riskTolerance ||
                "medium",
              financialGoals: userProfile?.financialGoals ||
                user.profile?.financialGoals || [
                  "Emergency Fund",
                  "House Down Payment",
                  "Retirement",
                ],
              currentSavings:
                userProfile?.currentSavings ||
                user.profile?.currentSavings ||
                15000000,
              monthlyExpenses:
                userProfile?.monthlyExpenses ||
                user.profile?.monthlyExpenses ||
                6000000,
            },
          });
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
