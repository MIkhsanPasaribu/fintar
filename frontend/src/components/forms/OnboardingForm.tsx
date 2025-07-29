"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  DollarSign,
  Target,
  ArrowRight,
  ArrowLeft,
  Check,
  SkipForward,
} from "lucide-react";

interface PersonalData {
  name: string;
  age: number;
  phone: string;
  company: string;
  educationLevel: string;
}

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  currentDebt: number;
  emergencyFundAmount: number;
  riskTolerance: "low" | "medium" | "high";
  financialGoals: string[];
}

interface OnboardingFormProps {
  onComplete: (data: {
    personal: PersonalData;
    financial: FinancialData;
  }) => void;
  onSkip: () => void;
}

const OnboardingForm = ({ onComplete, onSkip }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalData>({
    name: "",
    age: 25,
    phone: "",
    company: "",
    educationLevel: "",
  });
  const [financialData, setFinancialData] = useState<FinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    currentDebt: 0,
    emergencyFundAmount: 0,
    riskTolerance: "medium",
    financialGoals: [],
  });

  const steps = [
    {
      title: "Informasi Personal",
      description: "Ceritakan sedikit tentang diri Anda",
      icon: User,
    },
    {
      title: "Data Keuangan",
      description: "Informasi finansial untuk rekomendasi yang tepat",
      icon: DollarSign,
    },
    {
      title: "Tujuan Finansial",
      description: "Apa yang ingin Anda capai?",
      icon: Target,
    },
  ];

  const goalOptions = [
    "Dana Darurat",
    "Investasi Jangka Panjang",
    "Rumah",
    "Kendaraan",
    "Pendidikan",
    "Pensiun",
    "Liburan",
    "Modal Usaha",
  ];

  const educationOptions = ["SMA/SMK", "D3", "S1", "S2", "S3", "Lainnya"];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ personal: personalData, financial: financialData });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setFinancialData((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter((g) => g !== goal)
        : [...prev.financialGoals, goal],
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return personalData.name.trim() !== "" && personalData.age > 0;
      case 1:
        return (
          financialData.monthlyIncome > 0 && financialData.monthlyExpenses > 0
        );
      case 2:
        return financialData.financialGoals.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Selamat Datang di Fintar!</h1>
            <button
              onClick={onSkip}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <SkipForward className="h-4 w-4" />
              Skip
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStep
                      ? "bg-white text-blue-600"
                      : "bg-blue-500 text-blue-100"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded transition-colors ${
                      index < currentStep ? "bg-white" : "bg-blue-500"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                {React.createElement(steps[currentStep].icon, {
                  className: "h-8 w-8 text-blue-600",
                })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>

            {/* Step Content */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={personalData.name}
                    onChange={(e) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usia *
                    </label>
                    <input
                      type="number"
                      value={personalData.age}
                      onChange={(e) =>
                        setPersonalData((prev) => ({
                          ...prev,
                          age: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                      min="18"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      value={personalData.phone}
                      onChange={(e) =>
                        setPersonalData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perusahaan
                  </label>
                  <input
                    type="text"
                    value={personalData.company}
                    onChange={(e) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama perusahaan tempat Anda bekerja"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pendidikan Terakhir
                  </label>
                  <select
                    value={personalData.educationLevel}
                    onChange={(e) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        educationLevel: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih pendidikan terakhir</option>
                    {educationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pendapatan Bulanan *
                    </label>
                    <input
                      type="number"
                      value={financialData.monthlyIncome}
                      onChange={(e) =>
                        setFinancialData((prev) => ({
                          ...prev,
                          monthlyIncome: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5000000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pengeluaran Bulanan *
                    </label>
                    <input
                      type="number"
                      value={financialData.monthlyExpenses}
                      onChange={(e) =>
                        setFinancialData((prev) => ({
                          ...prev,
                          monthlyExpenses: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3000000"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tabungan Saat Ini
                    </label>
                    <input
                      type="number"
                      value={financialData.currentSavings}
                      onChange={(e) =>
                        setFinancialData((prev) => ({
                          ...prev,
                          currentSavings: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Hutang
                    </label>
                    <input
                      type="number"
                      value={financialData.currentDebt}
                      onChange={(e) =>
                        setFinancialData((prev) => ({
                          ...prev,
                          currentDebt: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dana Darurat
                  </label>
                  <input
                    type="number"
                    value={financialData.emergencyFundAmount}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        emergencyFundAmount: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15000000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Toleransi Risiko Investasi
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "low", label: "Rendah", desc: "Investasi aman" },
                      { value: "medium", label: "Sedang", desc: "Balanced" },
                      { value: "high", label: "Tinggi", desc: "Agresif" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          financialData.riskTolerance === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="riskTolerance"
                          value={option.value}
                          checked={financialData.riskTolerance === option.value}
                          onChange={(e) =>
                            setFinancialData((prev) => ({
                              ...prev,
                              riskTolerance: e.target.value as
                                | "low"
                                | "medium"
                                | "high",
                            }))
                          }
                          className="sr-only"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {option.desc}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Pilih Tujuan Finansial Anda *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => (
                      <label
                        key={goal}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          financialData.financialGoals.includes(goal)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={financialData.financialGoals.includes(goal)}
                          onChange={() => toggleGoal(goal)}
                          className="sr-only"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {goal}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Sebelumnya
          </button>

          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === steps.length - 1 ? "Selesai" : "Lanjutkan"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
