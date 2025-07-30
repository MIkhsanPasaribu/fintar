/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/tombol";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/kartu";
import { ArrowRight, DollarSign } from "lucide-react";

interface FinancialInfoStepProps {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  isLoading: boolean;
  data: any;
}

export function FinancialInfoStep({
  onNext,
  onSkip,
  onBack,
  isLoading,
  data,
}: FinancialInfoStepProps) {
  const [formData, setFormData] = useState({
    monthlyIncome: data.monthlyIncome || "",
    monthlyExpenses: data.monthlyExpenses || "",
    currentSavings: data.currentSavings || "",
    investments: data.investments || "",
    debts: data.debts || "",
    financialGoals: data.financialGoals || [],
    riskTolerance: data.riskTolerance || "",
    investmentExperience: data.investmentExperience || "",
    ...data,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome = "Pendapatan bulanan wajib diisi";
    }

    if (!formData.monthlyExpenses) {
      newErrors.monthlyExpenses = "Pengeluaran bulanan wajib diisi";
    }

    if (!formData.riskTolerance) {
      newErrors.riskTolerance = "Toleransi risiko wajib dipilih";
    }

    if (!formData.investmentExperience) {
      newErrors.investmentExperience = "Pengalaman investasi wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleFinancialGoal = (goal: string) => {
    setFormData((prev: { financialGoals: string[]; }) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter((g: string) => g !== goal)
        : [...prev.financialGoals, goal],
    }));
  };

  const financialGoalOptions = [
    { value: "emergency_fund", label: "Dana Darurat" },
    { value: "house", label: "Membeli Rumah" },
    { value: "education", label: "Pendidikan" },
    { value: "retirement", label: "Persiapan Pensiun" },
    { value: "investment", label: "Investasi Jangka Panjang" },
    { value: "business", label: "Modal Usaha" },
    { value: "vacation", label: "Liburan" },
    { value: "other", label: "Lainnya" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Income */}
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Pendapatan Bulanan *</Label>
          <Select
            value={formData.monthlyIncome}
            onValueChange={(value) => handleInputChange("monthlyIncome", value)}
          >
            <SelectTrigger
              className={errors.monthlyIncome ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Pilih rentang pendapatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kurang-3-juta">&lt; Rp 3.000.000</SelectItem>
              <SelectItem value="3-5-juta">
                Rp 3.000.000 - Rp 5.000.000
              </SelectItem>
              <SelectItem value="5-10-juta">
                Rp 5.000.000 - Rp 10.000.000
              </SelectItem>
              <SelectItem value="10-20-juta">
                Rp 10.000.000 - Rp 20.000.000
              </SelectItem>
              <SelectItem value="20-50-juta">
                Rp 20.000.000 - Rp 50.000.000
              </SelectItem>
              <SelectItem value="lebih-50-juta">&gt; Rp 50.000.000</SelectItem>
            </SelectContent>
          </Select>
          {errors.monthlyIncome && (
            <p className="text-sm text-red-500">{errors.monthlyIncome}</p>
          )}
        </div>

        {/* Monthly Expenses */}
        <div className="space-y-2">
          <Label htmlFor="monthlyExpenses">Pengeluaran Bulanan *</Label>
          <Select
            value={formData.monthlyExpenses}
            onValueChange={(value) =>
              handleInputChange("monthlyExpenses", value)
            }
          >
            <SelectTrigger
              className={errors.monthlyExpenses ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Pilih rentang pengeluaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kurang-2-juta">&lt; Rp 2.000.000</SelectItem>
              <SelectItem value="2-4-juta">
                Rp 2.000.000 - Rp 4.000.000
              </SelectItem>
              <SelectItem value="4-8-juta">
                Rp 4.000.000 - Rp 8.000.000
              </SelectItem>
              <SelectItem value="8-15-juta">
                Rp 8.000.000 - Rp 15.000.000
              </SelectItem>
              <SelectItem value="15-30-juta">
                Rp 15.000.000 - Rp 30.000.000
              </SelectItem>
              <SelectItem value="lebih-30-juta">&gt; Rp 30.000.000</SelectItem>
            </SelectContent>
          </Select>
          {errors.monthlyExpenses && (
            <p className="text-sm text-red-500">{errors.monthlyExpenses}</p>
          )}
        </div>

        {/* Current Savings */}
        <div className="space-y-2">
          <Label htmlFor="currentSavings">Total Tabungan Saat Ini</Label>
          <Select
            value={formData.currentSavings}
            onValueChange={(value) =>
              handleInputChange("currentSavings", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih rentang tabungan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kurang-5-juta">&lt; Rp 5.000.000</SelectItem>
              <SelectItem value="5-10-juta">
                Rp 5.000.000 - Rp 10.000.000
              </SelectItem>
              <SelectItem value="10-25-juta">
                Rp 10.000.000 - Rp 25.000.000
              </SelectItem>
              <SelectItem value="25-50-juta">
                Rp 25.000.000 - Rp 50.000.000
              </SelectItem>
              <SelectItem value="50-100-juta">
                Rp 50.000.000 - Rp 100.000.000
              </SelectItem>
              <SelectItem value="lebih-100-juta">
                &gt; Rp 100.000.000
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Investments */}
        <div className="space-y-2">
          <Label htmlFor="investments">Total Investasi Saat Ini</Label>
          <Select
            value={formData.investments}
            onValueChange={(value) => handleInputChange("investments", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih rentang investasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tidak ada</SelectItem>
              <SelectItem value="kurang-10-juta">&lt; Rp 10.000.000</SelectItem>
              <SelectItem value="10-25-juta">
                Rp 10.000.000 - Rp 25.000.000
              </SelectItem>
              <SelectItem value="25-50-juta">
                Rp 25.000.000 - Rp 50.000.000
              </SelectItem>
              <SelectItem value="50-100-juta">
                Rp 50.000.000 - Rp 100.000.000
              </SelectItem>
              <SelectItem value="lebih-100-juta">
                &gt; Rp 100.000.000
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Debts */}
        <div className="space-y-2">
          <Label htmlFor="debts">Total Hutang/Cicilan</Label>
          <Select
            value={formData.debts}
            onValueChange={(value) => handleInputChange("debts", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih rentang hutang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tidak ada</SelectItem>
              <SelectItem value="kurang-10-juta">&lt; Rp 10.000.000</SelectItem>
              <SelectItem value="10-25-juta">
                Rp 10.000.000 - Rp 25.000.000
              </SelectItem>
              <SelectItem value="25-50-juta">
                Rp 25.000.000 - Rp 50.000.000
              </SelectItem>
              <SelectItem value="50-100-juta">
                Rp 50.000.000 - Rp 100.000.000
              </SelectItem>
              <SelectItem value="lebih-100-juta">
                &gt; Rp 100.000.000
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-2">
          <Label htmlFor="riskTolerance">Toleransi Risiko *</Label>
          <Select
            value={formData.riskTolerance}
            onValueChange={(value) => handleInputChange("riskTolerance", value)}
          >
            <SelectTrigger
              className={errors.riskTolerance ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Pilih toleransi risiko" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">
                Konservatif (Risiko Rendah)
              </SelectItem>
              <SelectItem value="moderate">Moderat (Risiko Sedang)</SelectItem>
              <SelectItem value="aggressive">
                Agresif (Risiko Tinggi)
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.riskTolerance && (
            <p className="text-sm text-red-500">{errors.riskTolerance}</p>
          )}
        </div>

        {/* Investment Experience */}
        <div className="space-y-2">
          <Label htmlFor="investmentExperience">Pengalaman Investasi *</Label>
          <Select
            value={formData.investmentExperience}
            onValueChange={(value) =>
              handleInputChange("investmentExperience", value)
            }
          >
            <SelectTrigger
              className={errors.investmentExperience ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Pilih pengalaman investasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Pemula (&lt; 1 tahun)</SelectItem>
              <SelectItem value="intermediate">Menengah (1-3 tahun)</SelectItem>
              <SelectItem value="experienced">
                Berpengalaman (3-5 tahun)
              </SelectItem>
              <SelectItem value="expert">Ahli (&gt; 5 tahun)</SelectItem>
            </SelectContent>
          </Select>
          {errors.investmentExperience && (
            <p className="text-sm text-red-500">
              {errors.investmentExperience}
            </p>
          )}
        </div>
      </div>

      {/* Financial Goals */}
      <div className="space-y-4">
        <Label>Tujuan Finansial (Pilih yang sesuai)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {financialGoalOptions.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggleFinancialGoal(goal.value)}
              className={`p-3 rounded-lg border-2 text-sm text-center transition-all ${
                formData.financialGoals.includes(goal.value)
                  ? "border-[#0052CC] bg-[#0052CC]/10 text-[#0052CC]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">
                Analisis Profil Finansial
              </h4>
              <p className="text-sm text-green-700">
                Informasi ini membantu kami memberikan rekomendasi investasi dan
                perencanaan keuangan yang sesuai dengan kondisi dan tujuan Anda.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1"
        >
          Kembali
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          disabled={isLoading}
          className="flex-1"
        >
          Lewati Untuk Sekarang
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <span>Selesai</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
