/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calculator,
  DollarSign,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sparkles,
  Target,
  Atom,
} from "lucide-react";
import AIService from "@/lib/ai-api";
import { useUser } from "@/hooks/useUser";

interface FinancialData {
  income: number;
  expenses: {
    housing: number;
    food: number;
    transportation: number;
    utilities: number;
    entertainment: number;
    healthcare: number;
    other: number;
  };
  savings: number;
  debts?: {
    creditCard: number;
    loan: number;
    mortgage: number;
  };
  investments?: {
    stocks: number;
    bonds: number;
    mutualFunds: number;
    crypto: number;
  };
}

const FinancialAnalysisComponent = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"input" | "analysis">("input");

  // Helper function to safely get nested data
  const getInsightsData = (analysis: any) => {
    // Try multiple paths to find the insights data
    return (
      analysis?.data?.insights || // Backend response wrapped in data
      analysis?.insights || // Direct insights
      {}
    );
  };

  const getMetadata = (analysis: any) => {
    return (
      analysis?.metadata ||
      analysis?.data?.aiMetadata ||
      analysis?.aiMetadata ||
      {}
    );
  };

  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 8500000,
    expenses: {
      housing: 3500000,
      food: 1500000,
      transportation: 800000,
      utilities: 500000,
      entertainment: 600000,
      healthcare: 300000,
      other: 500000,
    },
    savings: 800000,
    debts: {
      creditCard: 2000000,
      loan: 5000000,
      mortgage: 0,
    },
    investments: {
      stocks: 1000000,
      bonds: 500000,
      mutualFunds: 2000000,
      crypto: 300000,
    },
  });

  const handleAnalyze = async (
    analysisType:
      | "budget"
      | "cash_flow"
      | "debt_analysis"
      | "investment_portfolio"
  ) => {
    if (!user) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the new AI insights endpoint
      const result = await AIService.analyzeFinancialData();

      // Debug: Log the complete result structure
      console.log("🔍 Full API Result:", result);
      console.log("🔍 Result Success:", result.success);
      console.log("🔍 Result Insights:", result.insights);
      console.log("🔍 Result Data:", result.data);
      console.log("🔍 Result Metadata:", result.metadata);

      if (result.success) {
        const analysisData = {
          insights: result.insights,
          data: result.data,
          metadata: result.metadata,
          analysisType,
          timestamp: new Date().toISOString(),
        };

        console.log("🔍 Setting Analysis Data:", analysisData);
        setAnalysis(analysisData);
        setActiveTab("analysis");
      } else {
        setError(result.error || "Gagal menganalisis data keuangan");
      }
    } catch (error) {
      console.error("Financial analysis error:", error);
      setError("Terjadi kesalahan saat menganalisis data keuangan");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFinancialData = (
    field: string,
    value: number,
    subField?: string
  ) => {
    if (subField) {
      setFinancialData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field as keyof FinancialData] as Record<string, number>),
          [subField]: value,
        },
      }));
    } else {
      setFinancialData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalExpenses = Object.values(financialData.expenses).reduce(
    (sum, val) => sum + val,
    0
  );
  const totalDebts = financialData.debts
    ? Object.values(financialData.debts).reduce((sum, val) => sum + val, 0)
    : 0;
  const totalInvestments = financialData.investments
    ? Object.values(financialData.investments).reduce(
        (sum, val) => sum + val,
        0
      )
    : 0;
  const monthlyBalance = financialData.income - totalExpenses;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Login Diperlukan
          </h3>
          <p className="text-gray-600">
            Silakan login untuk menggunakan fitur analisis keuangan AI.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Analisis Keuangan AI</h1>
          <p className="text-green-100 mb-6">
            Dapatkan insight mendalam tentang kondisi keuangan Anda dengan AI
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Balance Bulanan</div>
                <div className="text-sm text-green-100">
                  {formatCurrency(monthlyBalance)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <PieChart className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Total Investasi</div>
                <div className="text-sm text-green-100">
                  {formatCurrency(totalInvestments)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Total Utang</div>
                <div className="text-sm text-green-100">
                  {formatCurrency(totalDebts)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("input")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "input"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Input Data Keuangan
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "analysis"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Hasil Analisis AI
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "input" && (
            <div className="space-y-8">
              {/* Income Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pendapatan Bulanan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gaji/Pendapatan
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        value={financialData.income}
                        onChange={(e) =>
                          updateFinancialData("income", Number(e.target.value))
                        }
                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        placeholder="8500000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expenses Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pengeluaran Bulanan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(financialData.expenses).map(
                    ([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key === "housing"
                            ? "Rumah/Sewa"
                            : key === "food"
                            ? "Makanan"
                            : key === "transportation"
                            ? "Transportasi"
                            : key === "utilities"
                            ? "Utilitas"
                            : key === "entertainment"
                            ? "Hiburan"
                            : key === "healthcare"
                            ? "Kesehatan"
                            : "Lainnya"}
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            updateFinancialData(
                              "expenses",
                              Number(e.target.value),
                              key
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Savings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tabungan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tabungan Bulanan
                    </label>
                    <input
                      type="number"
                      value={financialData.savings}
                      onChange={(e) =>
                        updateFinancialData("savings", Number(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Analysis Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pilih Jenis Analisis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleAnalyze("budget")}
                    disabled={isLoading}
                    className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    <Calculator className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="font-medium">Analisis Budget</span>
                    <span className="text-sm text-gray-600 text-center">
                      Evaluasi alokasi pengeluaran
                    </span>
                  </button>

                  <button
                    onClick={() => handleAnalyze("cash_flow")}
                    disabled={isLoading}
                    className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                    <span className="font-medium">Analisis Cash Flow</span>
                    <span className="text-sm text-gray-600 text-center">
                      Proyeksi arus kas
                    </span>
                  </button>

                  <button
                    onClick={() => handleAnalyze("debt_analysis")}
                    disabled={isLoading}
                    className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                    <span className="font-medium">Analisis Utang</span>
                    <span className="text-sm text-gray-600 text-center">
                      Strategi pelunasan utang
                    </span>
                  </button>

                  <button
                    onClick={() => handleAnalyze("investment_portfolio")}
                    disabled={isLoading}
                    className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    <PieChart className="h-8 w-8 text-purple-600 mb-2" />
                    <span className="font-medium">Analisis Portfolio</span>
                    <span className="text-sm text-gray-600 text-center">
                      Optimasi investasi
                    </span>
                  </button>
                </div>

                {isLoading && (
                  <div className="mt-4 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                    <span className="text-gray-600">
                      AI sedang menganalisis data keuangan Anda...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {analysis ? (
                <div className="space-y-6">
                  {/* Debug information in development */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-sm font-mono">
                        <div>🔍 Debug Info:</div>
                        <div>
                          - analysis.insights type: {typeof analysis.insights}
                        </div>
                        <div>- analysis.data exists: {!!analysis.data}</div>
                        <div>
                          - getInsightsData result:{" "}
                          {JSON.stringify(getInsightsData(analysis), null, 2)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Analisis Selesai
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          AI telah berhasil menganalisis data keuangan Anda
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Source Indicator */}
                  {getMetadata(analysis)?.source && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm text-blue-700">
                          {getMetadata(analysis).source ===
                          "built-in-financial-rules"
                            ? "Analisis menggunakan sistem rules-based (AI eksternal sedang maintenance)"
                            : `Analisis menggunakan AI model: ${
                                getMetadata(analysis).model
                              }`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Financial Summary */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                      Ringkasan Kondisi Keuangan
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {getInsightsData(analysis)?.summary ||
                        analysis.insights ||
                        "Tidak ada ringkasan analisis tersedia"}
                    </p>

                    {/* Financial Metrics */}
                    {getInsightsData(analysis)?.financialMetrics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="text-sm text-green-600 font-medium">
                            Tingkat Menabung
                          </div>
                          <div className="text-2xl font-bold text-green-800">
                            {
                              getInsightsData(analysis).financialMetrics
                                .savingsRate
                            }
                            %
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="text-sm text-yellow-600 font-medium">
                            Rasio Utang vs Pendapatan
                          </div>
                          <div className="text-2xl font-bold text-yellow-800">
                            {
                              getInsightsData(analysis).financialMetrics
                                .debtToIncomeRatio
                            }
                            %
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="text-sm text-blue-600 font-medium">
                            Dana Darurat (Bulan)
                          </div>
                          <div className="text-2xl font-bold text-blue-800">
                            {
                              getInsightsData(analysis).financialMetrics
                                .emergencyFundMonths
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Opportunities/Recommendations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-500" />
                      Rekomendasi Perbaikan
                    </h3>
                    <div className="space-y-3">
                      {(getInsightsData(analysis)?.opportunities || []).map(
                        (opportunity: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-gray-700">{opportunity}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  {getInsightsData(analysis)?.riskAssessment && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                        Penilaian Risiko
                      </h3>
                      <div className="flex items-center mb-4">
                        <span className="text-sm text-gray-600 mr-3">
                          Tingkat Risiko:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            getInsightsData(analysis).riskAssessment.level ===
                            "low"
                              ? "bg-green-100 text-green-800"
                              : getInsightsData(analysis).riskAssessment
                                  .level === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getInsightsData(analysis).riskAssessment.level ===
                          "low"
                            ? "Rendah"
                            : getInsightsData(analysis).riskAssessment.level ===
                              "moderate"
                            ? "Sedang"
                            : "Tinggi"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {(
                          getInsightsData(analysis).riskAssessment
                            .recommendations || []
                        ).map((rec: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <Atom className="h-4 w-4 text-orange-500 mt-1 mr-2 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Debug Information (for development) */}
                  {process.env.NODE_ENV === "development" && (
                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                        Debug Data (Development Only)
                      </summary>
                      <pre className="whitespace-pre-wrap text-xs bg-white p-4 rounded mt-2 overflow-auto">
                        {JSON.stringify(analysis, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum Ada Analisis
                  </h3>
                  <p className="text-gray-600">
                    Silakan input data keuangan dan pilih jenis analisis
                    terlebih dahulu
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysisComponent;
