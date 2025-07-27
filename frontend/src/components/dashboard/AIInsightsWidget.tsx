"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  PieChart,
  Target,
  Loader2,
} from "lucide-react";
import AIService, { FinancialAdviceRequest } from "@/lib/ai-api";
import { useUser } from "@/hooks/useUser";

interface AIInsight {
  type: "advice" | "warning" | "opportunity" | "goal";
  title: string;
  description: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

const AIInsightsWidget = () => {
  const { user } = useUser();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      if (user) {
        await generateAIInsights();
      }
    };
    loadInsights();
  }, [user]);

  const generateAIInsights = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const request: FinancialAdviceRequest = {
        userId: user.id,
        sessionId: AIService.generateSessionId(),
        question:
          "Berikan insight keuangan dan rekomendasi berdasarkan profil saya",
        userProfile: {
          age: user.profile?.age || 28,
          income: user.profile?.income || 8500000,
          riskTolerance: user.profile?.riskTolerance || "medium",
          financialGoals: user.profile?.financialGoals || [
            "Emergency Fund",
            "Investment",
          ],
          currentSavings: user.profile?.currentSavings || 15000000,
          monthlyExpenses: user.profile?.monthlyExpenses || 6000000,
        },
      };

      await AIService.getFinancialAdvice(request);

      // Convert AI response to insights format
      const aiInsights = parseAIResponseToInsights();
      setInsights(aiInsights);
    } catch {
      setError("Gagal memuat AI insights");
      // Fallback to mock insights
      setInsights(getMockInsights());
    } finally {
      setIsLoading(false);
    }
  };

  const parseAIResponseToInsights = (): AIInsight[] => {
    // For now, return structured insights based on common financial advice
    // In a real implementation, you'd parse the AI response more intelligently
    return [
      {
        type: "advice",
        title: "Emergency Fund Status",
        description:
          "Anda sudah memiliki emergency fund yang baik. Pertahankan minimal 6 bulan pengeluaran.",
        priority: "medium",
      },
      {
        type: "opportunity",
        title: "Investment Opportunity",
        description:
          "Dengan risk tolerance medium, pertimbangkan diversifikasi ke reksa dana saham.",
        action: "Lihat rekomendasi investasi",
        priority: "high",
      },
      {
        type: "warning",
        title: "Budget Optimization",
        description:
          "Pengeluaran entertainment bisa dikurangi 20% untuk meningkatkan tabungan.",
        action: "Optimasi budget",
        priority: "medium",
      },
      {
        type: "goal",
        title: "Financial Goal Progress",
        description: "Anda on-track untuk mencapai target rumah dalam 3 tahun.",
        priority: "low",
      },
    ];
  };

  const getMockInsights = (): AIInsight[] => {
    return [
      {
        type: "advice",
        title: "Diversifikasi Portfolio",
        description:
          "Pertimbangkan untuk menambah alokasi investasi ke instrumen dengan risiko berbeda.",
        action: "Lihat rekomendasi",
        priority: "high",
      },
      {
        type: "warning",
        title: "Pengeluaran Tinggi",
        description:
          "Pengeluaran bulan ini 15% lebih tinggi dari rata-rata. Periksa kategori non-esensial.",
        action: "Analisis pengeluaran",
        priority: "medium",
      },
      {
        type: "opportunity",
        title: "Peluang Investasi",
        description:
          "Ada surplus cash flow yang bisa dialokasikan ke investasi jangka panjang.",
        action: "Mulai investasi",
        priority: "high",
      },
      {
        type: "goal",
        title: "Target Dana Darurat",
        description:
          "Anda sudah mencapai 80% dari target dana darurat. Excellent progress!",
        priority: "low",
      },
    ];
  };

  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "advice":
        return Sparkles;
      case "warning":
        return AlertTriangle;
      case "opportunity":
        return TrendingUp;
      case "goal":
        return Target;
      default:
        return CheckCircle;
    }
  };

  const getInsightColor = (
    type: AIInsight["type"],
    priority: AIInsight["priority"]
  ) => {
    if (type === "warning") return "text-red-600 bg-red-100";
    if (type === "opportunity") return "text-green-600 bg-green-100";
    if (type === "goal") return "text-blue-600 bg-blue-100";
    if (priority === "high") return "text-purple-600 bg-purple-100";
    return "text-gray-600 bg-gray-100";
  };

  const getPriorityBadge = (priority: AIInsight["priority"]) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority];
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            AI Insights
          </h3>
          <p className="text-gray-600">
            Login untuk melihat insight keuangan personal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Fintar AI Insights</h3>
              <p className="text-purple-100 text-sm">
                Solusi AI Finansial Terdepan
              </p>
            </div>
          </div>
          <button
            onClick={generateAIInsights}
            disabled={isLoading}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${getInsightColor(
                      insight.type,
                      insight.priority
                    )}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">
                        {insight.title}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(
                          insight.priority
                        )}`}
                      >
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {insights.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Insights
            </h4>
            <p className="text-gray-600 mb-4">
              Klik refresh untuk generate AI insights berdasarkan profil
              keuangan Anda
            </p>
            <button
              onClick={generateAIInsights}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsWidget;
