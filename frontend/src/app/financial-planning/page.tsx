"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Star,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  Orbit,
} from "lucide-react";
import AIService from "@/lib/ai-api";
import { useUser } from "@/hooks/useUser";

interface FinancialPlan {
  success: boolean;
  plan?: string;
  data?: unknown;
  metadata?: unknown;
  error?: string;
}

const FinancialPlanningPage = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<FinancialPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetPlan = async () => {
    if (!user) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await AIService.getFinancialAdvice();
      setPlan(result);
    } catch (error) {
      console.error("Error getting financial plan:", error);
      setError("Gagal membuat rencana keuangan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Fintar Financial Planning AI
          </h1>
          <p className="text-xl text-gray-600">
            Rencana Keuangan Jangka Panjang dengan AI untuk Masa Depan yang
            Lebih Baik
          </p>
        </motion.div>

        {/* AI Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Orbit className="h-6 w-6" />
              <div>
                <h3 className="text-lg font-bold">
                  AI Financial Planner Aktif
                </h3>
                <p className="text-green-100">
                  Sistem AI menganalisis kondisi keuangan Anda untuk membuat
                  rencana finansial jangka panjang yang komprehensif
                </p>
              </div>
            </div>
            <Calendar className="h-8 w-8 text-green-200" />
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
                <Sparkles className="h-6 w-6 text-green-600 mr-2" />
                Buat Rencana AI
              </h2>

              <p className="text-gray-600 mb-6">
                AI akan menganalisis profil keuangan Anda dan membuat rencana
                finansial jangka panjang yang komprehensif sesuai dengan tujuan
                hidup Anda.
              </p>

              <button
                onClick={handleGetPlan}
                disabled={isLoading || !user}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>AI Sedang Membuat Rencana...</span>
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5" />
                    <span>Buat Rencana Finansial dengan AI</span>
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
                Fitur Financial Planning AI
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Rencana Jangka Panjang (1-10 tahun)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Target Keuangan Realistis
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Strategi Menabung & Investasi
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Perencanaan Dana Darurat
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    Milestone & Progress Tracking
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
            {plan ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                  Rencana Keuangan AI
                </h3>

                {plan.success ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        ✅ Rencana Finansial Berhasil Dibuat
                      </h4>
                      <p className="text-green-700 text-sm">{plan.plan}</p>
                    </div>

                    {plan.data && (
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-800">
                          Rencana Strategis:
                        </h5>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-green-800">
                              Status Perencanaan:
                            </span>
                            <span className="text-sm text-green-700 ml-2">
                              Optimal & Komprehensif
                            </span>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-blue-800">
                              Timeline:
                            </span>
                            <span className="text-sm text-blue-700 ml-2">
                              Jangka Panjang (1-5 tahun)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {plan.metadata && (
                      <div className="text-xs text-gray-500 mt-4">
                        Rencana dibuat oleh Fintar Financial Planning AI pada{" "}
                        {new Date().toLocaleString("id-ID")}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">
                      ❌ Gagal Membuat Rencana
                    </h4>
                    <p className="text-red-700 text-sm">
                      {plan.error || "Terjadi kesalahan saat memproses"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Siap untuk Perencanaan Finansial
                  </h3>
                  <p className="text-gray-500">
                    Klik tombol Buat Rencana Finansial dengan AI untuk
                    mendapatkan roadmap keuangan yang komprehensif
                  </p>
                </div>
              </div>
            )}

            {/* Planning Tips */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Star className="h-5 w-5 text-green-600 mr-2" />
                Tips Perencanaan Keuangan
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Tetapkan tujuan finansial yang spesifik dan terukur</p>
                <p>• Buat rencana darurat dengan dana 6-12 bulan pengeluaran</p>
                <p>• Review dan sesuaikan rencana secara berkala</p>
                <p>• Mulai investasi sedini mungkin untuk compound interest</p>
                <p>• Diversifikasi sumber pendapatan dan investasi</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanningPage;
