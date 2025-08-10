"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Target,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Shield,
  Zap,
  ArrowRight,
  TrendingDown,
  Info,
  Star,
  Clock,
  Award,
} from "lucide-react";

interface InvestmentRecommendation {
  type: string;
  name: string;
  allocation: number;
  expectedReturn: string;
  risk: string;
  reason: string;
  minimumInvestment: string;
}

interface MarketTrend {
  trend: string;
  change: string;
  outlook: string;
}

interface ActionPlan {
  phase: string;
  timeframe: string;
  actions: string[];
}

interface InvestmentAIData {
  success: boolean;
  profile: {
    monthlyIncome: number;
    monthlyExpenses: number;
    availableForInvestment: number;
    currentSavings: number;
    riskTolerance: string;
    investmentExperience: string;
    age: number;
  };
  recommendations: {
    primary: InvestmentRecommendation[];
    alternative: Array<{
      type: string;
      allocation: number;
      reason: string;
    }>;
  };
  aiInsights: {
    summary: string;
    model: string;
    confidence: number;
  };
  marketAnalysis: {
    indonesianMarket: {
      ihsgTrend: string;
      sentiment: string;
      keyFactors: string[];
    };
    globalMarket: {
      trend: string;
      impact: string;
      keyFactors: string[];
    };
  };
  actionPlan: ActionPlan[];
}

interface MarketTrendData {
  success: boolean;
  marketTrends: {
    summary: string;
    sectors: Record<string, MarketTrend>;
    recommendations: string[];
    riskFactors: string[];
  };
}

const InvestmentAIDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [investmentData, setInvestmentData] = useState<InvestmentAIData | null>(
    null
  );
  const [marketData, setMarketData] = useState<MarketTrendData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock API call - replace with actual API client
  const fetchInvestmentData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock data structure matching backend response
      setInvestmentData({
        success: true,
        profile: {
          monthlyIncome: 15000000,
          monthlyExpenses: 10000000,
          availableForInvestment: 5000000,
          currentSavings: 50000000,
          riskTolerance: "MODERATE",
          investmentExperience: "Menengah",
          age: 32,
        },
        recommendations: {
          primary: [
            {
              type: "REKSADANA",
              name: "Reksadana Campuran",
              allocation: 40,
              expectedReturn: "8-12%",
              risk: "Menengah",
              reason:
                "Cocok untuk investor dengan profil risiko seimbang dan pengalaman menengah",
              minimumInvestment: "Rp 100,000",
            },
            {
              type: "SAHAM",
              name: "Saham Blue Chip",
              allocation: 30,
              expectedReturn: "10-15%",
              risk: "Menengah-Tinggi",
              reason:
                "Potensi pertumbuhan jangka panjang yang baik dengan dividen stabil",
              minimumInvestment: "Rp 500,000",
            },
            {
              type: "OBLIGASI",
              name: "Surat Utang Negara (SUN)",
              allocation: 30,
              expectedReturn: "6-8%",
              risk: "Rendah",
              reason:
                "Memberikan stabilitas dan pendapatan tetap yang dapat diandalkan",
              minimumInvestment: "Rp 1,000,000",
            },
          ],
          alternative: [
            {
              type: "EMAS",
              allocation: 10,
              reason: "Hedge inflasi dan diversifikasi portfolio",
            },
            {
              type: "P2P_LENDING",
              allocation: 5,
              reason: "Pendapatan pasif dengan risiko terukur",
            },
          ],
        },
        aiInsights: {
          summary:
            "Berdasarkan profil keuangan Anda, kami merekomendasikan portfolio yang seimbang antara pertumbuhan dan stabilitas...",
          model: "Gemini Pro",
          confidence: 0.87,
        },
        marketAnalysis: {
          indonesianMarket: {
            ihsgTrend: "Positif",
            sentiment: "Optimis",
            keyFactors: [
              "Pemulihan ekonomi",
              "Stabilitas politik",
              "Inflasi terkendali",
            ],
          },
          globalMarket: {
            trend: "Mixed",
            impact: "Menengah",
            keyFactors: ["Kebijakan Fed", "Geopolitik", "Komoditas"],
          },
        },
        actionPlan: [
          {
            phase: "Tahap 1: Optimasi Portfolio",
            timeframe: "1-3 bulan",
            actions: [
              "Rebalancing portfolio sesuai rekomendasi",
              "Buka akun reksadana di platform terpercaya",
              "Mulai investasi rutin bulanan",
            ],
          },
          {
            phase: "Tahap 2: Diversifikasi",
            timeframe: "3-6 bulan",
            actions: [
              "Tambahkan eksposur saham blue chip",
              "Pertimbangkan investasi obligasi pemerintah",
              "Monitor dan evaluasi performa",
            ],
          },
        ],
      });
    } catch (err) {
      setError("Gagal mengambil data rekomendasi investasi");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketData = async () => {
    try {
      // Mock market data
      setMarketData({
        success: true,
        marketTrends: {
          summary:
            "Pasar saham Indonesia menunjukkan tren positif dengan indeks IHSG menguat 2.5% dalam sebulan terakhir.",
          sectors: {
            financial: {
              trend: "bullish",
              change: "+3.2%",
              outlook: "Positif",
            },
            technology: {
              trend: "bullish",
              change: "+5.1%",
              outlook: "Sangat Positif",
            },
            consumer: { trend: "neutral", change: "+0.8%", outlook: "Stabil" },
            energy: { trend: "bearish", change: "-1.5%", outlook: "Negatif" },
            infrastructure: {
              trend: "bullish",
              change: "+2.8%",
              outlook: "Positif",
            },
          },
          recommendations: [
            "Sektor teknologi menunjukkan momentum positif untuk investasi jangka menengah",
            "Sektor keuangan masih menarik dengan valuasi yang wajar",
            "Diversifikasi portfolio dengan mempertimbangkan sektor infrastruktur",
          ],
          riskFactors: [
            "Volatilitas global masih tinggi",
            "Inflasi domestik perlu diperhatikan",
            "Kebijakan moneter BI dapat mempengaruhi likuiditas pasar",
          ],
        },
      });
    } catch (err) {
      console.error("Failed to fetch market data:", err);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "rendah":
        return "text-green-600 bg-green-100";
      case "menengah":
      case "menengah-tinggi":
        return "text-yellow-600 bg-yellow-100";
      case "tinggi":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Investment AI</h1>
                  <p className="text-blue-100 mt-1">
                    Rekomendasi Investasi Cerdas Berbasis AI
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchInvestmentData}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="h-5 w-5" />
                  )}
                  <span>Analisis AI</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="flex space-x-2">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "recommendations", label: "Rekomendasi", icon: Target },
                { id: "market", label: "Analisis Pasar", icon: TrendingUp },
                { id: "action-plan", label: "Rencana Aksi", icon: Award },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Sparkles className="h-6 w-6 text-blue-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-gray-600 mt-4 font-medium">
              AI sedang menganalisis profil investasi Anda...
            </p>
            <p className="text-gray-500 text-sm mt-1">Mohon tunggu sebentar</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="text-red-800 font-medium">Terjadi Kesalahan</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {!isLoading && investmentData && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <OverviewTab data={investmentData} />
              )}
              {activeTab === "recommendations" && (
                <RecommendationsTab data={investmentData} />
              )}
              {activeTab === "market" && (
                <MarketAnalysisTab marketData={marketData} />
              )}
              {activeTab === "action-plan" && (
                <ActionPlanTab data={investmentData} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State */}
        {!isLoading && !investmentData && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Mulai Analisis Investasi
              </h2>
              <p className="text-gray-600 mb-8">
                Klik tombol &quot;Analisis AI&quot; untuk mendapatkan
                rekomendasi investasi yang dipersonalisasi berdasarkan profil
                keuangan Anda.
              </p>
              <button
                onClick={fetchInvestmentData}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Zap className="h-5 w-5" />
                <span className="font-medium">Mulai Analisis AI</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data }: { data: InvestmentAIData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Summary */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <PieChart className="h-6 w-6 text-blue-600" />
            <span>Profil Keuangan</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Pendapatan Bulanan</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data.profile.monthlyIncome)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Tersedia untuk Investasi</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data.profile.availableForInvestment)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Tabungan Saat Ini</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data.profile.currentSavings)}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Profil Risiko</p>
              <p className="text-2xl font-bold text-orange-600">
                {data.profile.riskTolerance}
              </p>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-xl">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <span>AI Insights</span>
            </h3>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {data.aiInsights.summary}
              </p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>
                    Confidence: {(data.aiInsights.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Model: {data.aiInsights.model}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Kondisi Pasar</span>
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">
                Pasar Indonesia
              </p>
              <p className="text-green-700">
                {data.marketAnalysis.indonesianMarket.ihsgTrend} -{" "}
                {data.marketAnalysis.indonesianMarket.sentiment}
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">
                Pasar Global
              </p>
              <p className="text-yellow-700">
                {data.marketAnalysis.globalMarket.trend} - Dampak{" "}
                {data.marketAnalysis.globalMarket.impact}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Faktor Kunci</span>
          </h3>

          <div className="space-y-3">
            {data.marketAnalysis.indonesianMarket.keyFactors.map(
              (factor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{factor}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Other tab components would go here...
const RecommendationsTab = ({ data }: { data: InvestmentAIData }) => (
  <div className="text-center p-8">
    <h2 className="text-2xl font-bold text-gray-800">Rekomendasi Investasi</h2>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const MarketAnalysisTab = ({
  marketData,
}: {
  marketData: MarketTrendData | null;
}) => (
  <div className="text-center p-8">
    <h2 className="text-2xl font-bold text-gray-800">Analisis Pasar</h2>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const ActionPlanTab = ({ data }: { data: InvestmentAIData }) => (
  <div className="text-center p-8">
    <h2 className="text-2xl font-bold text-gray-800">Rencana Aksi</h2>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

export default InvestmentAIDashboard;
