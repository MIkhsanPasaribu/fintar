"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/hooks/useOnboarding";
import { PersonalInfoStep } from "@/components/onboarding/PersonalInfoStep";
import { FinancialInfoStep } from "@/components/onboarding/FinancialInfoStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  {
    id: "personal",
    title: "Informasi Personal",
    description: "Lengkapi profil personal Anda",
    component: PersonalInfoStep,
  },
  {
    id: "financial",
    title: "Informasi Keuangan",
    description: "Bantu kami memahami kondisi keuangan Anda",
    component: FinancialInfoStep,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const {
    onboardingStatus,
    currentStep,
    isLoading,
    error,
    nextStep,
    prevStep,
    skipOnboarding,
    canAccessFeatures,
  } = useOnboarding();

  useEffect(() => {
    // Redirect if already completed
    if (onboardingStatus?.onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [onboardingStatus, router]);

  const handleSkipAll = async () => {
    try {
      await skipOnboarding();
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to skip onboarding:", err);
    }
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  if (isLoading && !onboardingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep]?.component;
  const isLastStep = currentStep === STEPS.length - 1;
  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang di Fintar
          </h1>
          <p className="text-gray-600">
            Mari lengkapi profil Anda untuk pengalaman yang lebih personal
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Langkah {currentStep + 1} dari {STEPS.length}
            </span>
            <span>{Math.round(progressPercentage)}% selesai</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Title */}
        {STEPS[currentStep] && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-gray-600">{STEPS[currentStep].description}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Step Component */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {CurrentStepComponent && (
              <CurrentStepComponent
                onNext={nextStep}
                onSkip={nextStep}
                onBack={prevStep}
                isLoading={isLoading}
                data={{}}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep} disabled={isLoading}>
                Kembali
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={currentStep === 0 ? handleSkipAll : nextStep}
              disabled={isLoading}
            >
              {currentStep === 0 ? "Lewati Semua" : "Lewati"}
            </Button>

            {isLastStep ? (
              <Button onClick={handleComplete} disabled={isLoading}>
                Selesai
              </Button>
            ) : (
              <Button onClick={nextStep} disabled={isLoading}>
                Lanjut
              </Button>
            )}
          </div>
        </div>

        {/* Skip Warning */}
        {onboardingStatus && !canAccessFeatures() && (
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Akses Terbatas
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Beberapa fitur tidak tersedia sampai Anda melengkapi profil.
                    Anda dapat melengkapinya kapan saja di halaman Profil.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
