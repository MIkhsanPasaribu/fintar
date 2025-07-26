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
} from "lucide-react";
import AIService, { FinancialAnalysisRequest } from "@/lib/ai-api";
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
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"input" | "analysis">("input");

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
      const request: FinancialAnalysisRequest = {
        userId: user.id,
        sessionId: AIService.generateSessionId(),
        financialData,
        analysisType,
      };

      const result = await AIService.analyzeFinancialData(request);
      setAnalysis(result);
      setActiveTab("analysis");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan dalam analisis"
      );
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

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Hasil Analisis AI
                    </h3>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                        {JSON.stringify(analysis, null, 2)}
                      </pre>
                    </div>
                  </div>
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
