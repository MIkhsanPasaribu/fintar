"use client";

import { useEffect, useState } from "react";
import { useSUS } from "@/hooks/useSUS";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";

interface SUSStatistics {
  totalResponses: number;
  averageScore: number;
  medianScore: number;
  minScore: number;
  maxScore: number;
  standardDeviation: number;
  gradeDistribution: Record<string, number>;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export default function SUSStatsDashboard() {
  const { getSUSStatistics } = useSUS();
  const [stats, setStats] = useState<SUSStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const data = await getSUSStatistics();
      if (data) {
        setStats(data);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, [getSUSStatistics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">
          Tidak ada data SUS yang tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          SUS Statistics Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive System Usability Scale metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Responses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalResponses}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Responses
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Average
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.averageScore.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Average SUS Score
          </div>
        </div>

        {/* Median Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Median
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.medianScore.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Median Score
          </div>
        </div>

        {/* Std Deviation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Std Dev
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.standardDeviation.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Standard Deviation
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Grade Distribution
        </h3>
        <div className="space-y-4">
          {Object.entries(stats.gradeDistribution).map(([grade, count]) => {
            const percentage =
              stats.totalResponses > 0
                ? (count / stats.totalResponses) * 100
                : 0;
            const gradeColor =
              grade === "A+" || grade === "A"
                ? "bg-green-500"
                : grade === "B"
                ? "bg-blue-500"
                : grade === "C"
                ? "bg-yellow-500"
                : grade === "D"
                ? "bg-orange-500"
                : "bg-red-500";

            return (
              <div key={grade}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Grade {grade}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${gradeColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Percentiles */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Score Percentiles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.percentiles.p25.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              25th Percentile
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.percentiles.p50.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              50th Percentile
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.percentiles.p75.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              75th Percentile
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.percentiles.p90.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              90th Percentile
            </div>
          </div>
        </div>
      </div>

      {/* Score Range */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Score Range
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Minimum
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.minScore.toFixed(1)}
            </div>
          </div>
          <div className="flex-1 mx-8">
            <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Maximum
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.maxScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
