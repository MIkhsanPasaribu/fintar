// Onboarding API Service
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api/v1";

export interface OnboardingData {
  personalInfo?: {
    dateOfBirth?: string;
    gender?: string;
    occupation?: string;
    company?: string;
    phone?: string;
  };
  financialInfo?: {
    monthlyIncome?: string;
    monthlyExpenses?: string;
    currentSavings?: string;
    investments?: string;
    debts?: string;
    financialGoals?: string[];
    riskTolerance?: string;
    investmentExperience?: string;
  };
}

export interface OnboardingStatus {
  onboardingCompleted: boolean;
  profileCompleted: boolean;
  financialDataCompleted: boolean;
  hasProfile: boolean;
  hasFinancialData: boolean;
}

class OnboardingService {
  private async getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getOnboardingStatus(): Promise<OnboardingStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/onboarding/status`, {
        method: "GET",
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to get onboarding status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting onboarding status:", error);
      // Return default status if API fails
      return {
        onboardingCompleted: false,
        profileCompleted: false,
        financialDataCompleted: false,
        hasProfile: false,
        hasFinancialData: false,
      };
    }
  }

  async submitPersonalInfo(
    data: OnboardingData["personalInfo"]
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "POST",
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit personal info");
      }

      // Update onboarding step
      await this.updateOnboardingStep("profile", true);
    } catch (error) {
      console.error("Error submitting personal info:", error);
      throw error;
    }
  }

  async submitFinancialInfo(
    data: OnboardingData["financialInfo"]
  ): Promise<void> {
    try {
      // In a real app, you might have a separate financial data endpoint
      const response = await fetch(`${API_BASE_URL}/users/financial-data`, {
        method: "POST",
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit financial info");
      }

      // Update onboarding step
      await this.updateOnboardingStep("financial", true);
    } catch (error) {
      console.error("Error submitting financial info:", error);
      throw error;
    }
  }

  async updateOnboardingStep(
    step: "profile" | "financial",
    completed: boolean
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/onboarding/${step}`, {
        method: "PATCH",
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${step} step`);
      }
    } catch (error) {
      console.error(`Error updating ${step} step:`, error);
      throw error;
    }
  }

  async skipOnboarding(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/onboarding/skip`, {
        method: "POST",
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to skip onboarding");
      }
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      throw error;
    }
  }

  async getUserProfile(): Promise<Record<string, unknown> | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "GET",
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to get user profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  async updateUserProfile(data: Record<string, unknown>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PATCH",
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}

export const onboardingService = new OnboardingService();
