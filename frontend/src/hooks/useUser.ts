import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
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
    // Simulate loading user data
    // In real app, this would come from your auth system
    const loadUser = async () => {
      try {
        // Check if user is logged in (from localStorage, auth context, etc.)
        const token = localStorage.getItem("auth_token");
        if (token) {
          // For now, create a mock user
          // In real app, you'd fetch from your auth service
          const mockUser: User = {
            id: `user_${Date.now()}`,
            email: "user@example.com",
            name: "Current User",
            profile: {
              age: 28,
              income: 8500000,
              riskTolerance: "medium",
              financialGoals: [
                "Emergency Fund",
                "House Down Payment",
                "Retirement",
              ],
              currentSavings: 15000000,
              monthlyExpenses: 6000000,
            },
          };
          setUser(mockUser);
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

  return {
    user,
    isLoading,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
  };
};

export default useUser;
