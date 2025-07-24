"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calculator,
  Target,
} from "lucide-react";

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  investments: number;
  debts: number;
  goals: string[];
}

interface AnalysisResult {
  analysisId: string;
  summary: string;
  recommendations: string[];
  riskLevel: "low" | "moderate" | "high";
  confidence: number;
  fallback?: boolean;
}

export default function FinancialAnalysis() {
  const [formData, setFormData] = useState<FinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0,
    investments: 0,
    debts: 0,
    goals: [],
  });

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  const handleInputChange = (
    field: keyof FinancialData,
    value: number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addGoal = () => {
    if (newGoal.trim() && formData.goals.length < 5) {
      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const analyzeFinances = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/financial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisType: "comprehensive",
          data: formData,
          preferences: {
            riskTolerance: "moderate",
            investmentHorizon: "medium",
            goals: formData.goals,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Financial analysis error:", error);
      // Show error to user
      setAnalysis({
        analysisId: "error",
        summary:
          "Terjadi kesalahan saat melakukan analisis. Silakan coba lagi.",
        recommendations: [
          "Periksa koneksi internet",
          "Pastikan semua data sudah diisi dengan benar",
        ],
        riskLevel: "moderate",
        confidence: 0,
        fallback: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500 bg-green-500/20";
      case "moderate":
        return "text-yellow-500 bg-yellow-500/20";
      case "high":
        return "text-red-500 bg-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      case "moderate":
        return <AlertCircle className="w-4 h-4" />;
      case "high":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const netWorth = formData.savings + formData.investments - formData.debts;
  const savingsRate =
    formData.monthlyIncome > 0
      ? ((formData.monthlyIncome - formData.monthlyExpenses) /
          formData.monthlyIncome) *
        100
      : 0;

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="glass-effect border-primary-light/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-primary-400" />
            <span>Fintar Financial Analysis</span>
          </CardTitle>
          <p className="text-sm text-font-secondary">
            Masukkan data keuangan Anda untuk mendapatkan analisis mendalam dan
            rekomendasi personal
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Financial Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Pendapatan Bulanan (Rp)
              </label>
              <Input
                type="number"
                value={formData.monthlyIncome || ""}
                onChange={(e) =>
                  handleInputChange("monthlyIncome", Number(e.target.value))
                }
                placeholder="0"
                className="text-right"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Pengeluaran Bulanan (Rp)
              </label>
              <Input
                type="number"
                value={formData.monthlyExpenses || ""}
                onChange={(e) =>
                  handleInputChange("monthlyExpenses", Number(e.target.value))
                }
                placeholder="0"
                className="text-right"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Tabungan (Rp)
              </label>
              <Input
                type="number"
                value={formData.savings || ""}
                onChange={(e) =>
                  handleInputChange("savings", Number(e.target.value))
                }
                placeholder="0"
                className="text-right"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Investasi (Rp)
              </label>
              <Input
                type="number"
                value={formData.investments || ""}
                onChange={(e) =>
                  handleInputChange("investments", Number(e.target.value))
                }
                placeholder="0"
                className="text-right"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-font-light mb-2 block">
                Hutang (Rp)
              </label>
              <Input
                type="number"
                value={formData.debts || ""}
                onChange={(e) =>
                  handleInputChange("debts", Number(e.target.value))
                }
                placeholder="0"
                className="text-right"
              />
            </div>
          </div>

          {/* Financial Goals */}
          <div>
            <label className="text-sm font-medium text-font-light mb-2 block">
              Tujuan Keuangan
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Tambah tujuan keuangan..."
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
              />
              <Button
                onClick={addGoal}
                disabled={!newGoal.trim() || formData.goals.length >= 5}
                size="sm"
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.goals.map((goal, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-500/20"
                  onClick={() => removeGoal(index)}
                >
                  {goal} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-primary-dark/10 rounded-lg border border-primary-light/20">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <DollarSign className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">Net Worth</span>
              </div>
              <p
                className={`font-semibold ${netWorth >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                Rp {netWorth.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <PieChart className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">Savings Rate</span>
              </div>
              <p
                className={`font-semibold ${savingsRate >= 20 ? "text-green-400" : savingsRate >= 10 ? "text-yellow-400" : "text-red-400"}`}
              >
                {savingsRate.toFixed(1)}%
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Target className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">Goals</span>
              </div>
              <p className="font-semibold text-font-light">
                {formData.goals.length}/5
              </p>
            </div>
          </div>

          <Button
            onClick={analyzeFinances}
            disabled={isLoading || formData.monthlyIncome <= 0}
            className="w-full bg-primary-500 hover:bg-primary-600"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Menganalisis dengan Fintar AI...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" />
                Analisis Keuangan Saya
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="glass-effect border-primary-light/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Hasil Analisis Keuangan</span>
              <div className="flex items-center space-x-2">
                {analysis.fallback && (
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500"
                  >
                    Offline Mode
                  </Badge>
                )}
                <Badge
                  className={`${getRiskColor(analysis.riskLevel)} border-0`}
                >
                  <span className="flex items-center space-x-1">
                    {getRiskIcon(analysis.riskLevel)}
                    <span>Risk: {analysis.riskLevel}</span>
                  </span>
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <h4 className="font-semibold text-font-light mb-3">
                Ringkasan Analisis
              </h4>
              <p className="text-font-secondary leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-font-light mb-3">
                Rekomendasi
              </h4>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-teal-dark/10 border border-teal-light/20 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <span className="text-font-secondary">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center justify-between p-4 bg-primary-dark/10 rounded-lg border border-primary-light/20">
              <span className="text-sm font-medium">Confidence Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {(analysis.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
