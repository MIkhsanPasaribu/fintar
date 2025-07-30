"use client";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {
  onboardingService,
  OnboardingData,
  OnboardingStatus,
} from "@/lib/services/onboarding";

interface OnboardingContextType {
  onboardingStatus: OnboardingStatus | null;
  onboardingData: OnboardingData;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  submitPersonalInfo: () => Promise<void>;
  submitFinancialInfo: () => Promise<void>;
  skipStep: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  canAccessFeatures: () => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const ONBOARDING_STEPS = [
  { id: "personal", title: "Informasi Personal", required: false },
  { id: "financial", title: "Informasi Keuangan", required: false },
];

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const refreshStatus = async () => {
    try {
      setIsLoading(true);
      const status = await onboardingService.getOnboardingStatus();
      setOnboardingStatus(status);
    } catch (err) {
      console.error("Failed to refresh onboarding status:", err);
      setError("Gagal memuat status onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const submitPersonalInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!onboardingData.personalInfo) {
        throw new Error("Data personal info tidak lengkap");
      }

      await onboardingService.submitPersonalInfo(onboardingData.personalInfo);
      await refreshStatus();

      // Auto proceed to next step
      setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan informasi personal";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitFinancialInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!onboardingData.financialInfo) {
        throw new Error("Data financial info tidak lengkap");
      }

      await onboardingService.submitFinancialInfo(onboardingData.financialInfo);
      await refreshStatus();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan informasi keuangan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const skipStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const skipOnboarding = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await onboardingService.skipOnboarding();
      await refreshStatus();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal melewati onboarding";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const canAccessFeatures = () => {
    if (!onboardingStatus) return false;

    // User can access features if they have completed enough onboarding
    // At minimum, they should have some profile data
    const hasMinimumData =
      onboardingStatus.hasProfile || onboardingStatus.profileCompleted;

    return hasMinimumData;
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const value: OnboardingContextType = {
    onboardingStatus,
    onboardingData,
    currentStep,
    isLoading,
    error,
    updateOnboardingData,
    submitPersonalInfo,
    submitFinancialInfo,
    skipStep,
    nextStep,
    prevStep,
    skipOnboarding,
    refreshStatus,
    canAccessFeatures,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
