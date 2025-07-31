"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Star,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import AIService from "@/lib/ai-api";
import { useUser } from "@/hooks/useUser";

const BudgetAIPage = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!user) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await AIService.getBudgetRecommendations();
      setRecommendations(result);
    } catch (error) {
      console.error("Error getting budget recommendations:", error);
      setError("Gagal mendapatkan rekomendasi budget. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Fintar Budget AI
          </h1>
          <p className="text-xl text-gray-600">
            Rekomendasi Budget Cerdas dengan AI untuk Optimalisasi Keuangan Anda
          </p>
        </motion.div>

        {/* AI Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Star className="h-6 w-6" />
              <div>
                <h3 className="text-lg font-bold">AI Budget Analyzer Aktif</h3>
                <p className="text-blue-100">
                  Sistem AI menganalisis pola keuangan Anda untuk memberikan
                  rekomendasi budget yang optimal
                </p>
              </div>
            </div>
            <Sparkles className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Action Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="h-6 w-6 text-blue-600 mr-2" />
                Dapatkan Rekomendasi AI
              </h2>

              <p className="text-gray-600 mb-6">
                AI akan menganalisis profil keuangan Anda dan memberikan
                rekomendasi budget yang personal dan optimal.
              </p>

              <button
                onClick={handleGetRecommendations}
                disabled={isLoading || !user}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>AI Sedang Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Analisis dengan AI</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Fitur Budget AI
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Analisis Pola Pengeluaran
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Rekomendasi Alokasi Budget
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Optimalisasi Pengeluaran
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Target Savings Realistis
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {recommendations ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                  Rekomendasi AI Budget
                </h3>

                {recommendations.success ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        ✅ Analisis Berhasil
                      </h4>
                      <p className="text-green-700 text-sm">
                        {recommendations.recommendations}
                      </p>
                    </div>

                    {recommendations.data && (
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-800">
                          Detail Rekomendasi:
                        </h5>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-blue-800">
                              Status AI:
                            </span>
                            <span className="text-sm text-blue-700 ml-2">
                              Aktif & Optimal
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {recommendations.metadata && (
                      <div className="text-xs text-gray-500 mt-4">
                        Diproses oleh Fintar AI pada{" "}
                        {new Date().toLocaleString("id-ID")}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">
                      ❌ Gagal Menganalisis
                    </h4>
                    <p className="text-red-700 text-sm">
                      {recommendations.error ||
                        "Terjadi kesalahan saat memproses"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Siap untuk Analisis AI
                  </h3>
                  <p className="text-gray-500">
                    Klik tombol "Analisis dengan AI" untuk mendapatkan
                    rekomendasi budget yang personal
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAIPage;
