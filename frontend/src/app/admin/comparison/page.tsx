/**
 * Comparison Dashboard Page
 *
 * Admin dashboard for AI vs Baseline comparison analysis
 * Integrates all comparison visualization components
 *
 * Features:
 * - Comparison overview with key metrics
 * - Score comparison charts
 * - Win rate visualization
 * - Statistical significance analysis
 * - Data export controls
 * - Date range filtering
 *
 * @author Fintar Team
 */

"use client";

import React, { useEffect, useState } from "react";
import { useComparison } from "@/hooks/useComparison";
import ComparisonOverview from "@/components/comparison/ComparisonOverview";
import ScoreComparisonChart from "@/components/comparison/ScoreComparisonChart";
import WinRateChart from "@/components/comparison/WinRateChart";
import StatisticalSignificancePanel from "@/components/comparison/StatisticalSignificancePanel";
import ExportControls from "@/components/comparison/ExportControls";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BarChart3, Loader2 } from "lucide-react";

export default function ComparisonDashboard() {
  const {
    statistics,
    statisticalAnalysis,
    isLoadingStats,
    isLoadingAnalysis,
    error,
    getComparisonStatistics,
    getStatisticalAnalysis,
    clearError,
  } = useComparison();

  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  /**
   * Load initial data
   */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load statistics and analysis
   */
  const loadData = async () => {
    await Promise.all([
      getComparisonStatistics(
        dateRange.startDate || undefined,
        dateRange.endDate || undefined
      ),
      getStatisticalAnalysis(
        dateRange.startDate || undefined,
        dateRange.endDate || undefined
      ),
    ]);
  };

  /**
   * Handle date range change
   */
  const handleDateRangeChange = (
    startDate: string | null,
    endDate: string | null
  ) => {
    setDateRange({ startDate, endDate });
    // Reload data with new date range
    setTimeout(() => {
      getComparisonStatistics(startDate || undefined, endDate || undefined);
      getStatisticalAnalysis(startDate || undefined, endDate || undefined);
    }, 100);
  };

  /**
   * Loading State
   */
  if (isLoadingStats || isLoadingAnalysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading comparison analysis...
          </p>
        </div>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                  Error Loading Data
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                <div className="flex gap-2">
                  <button
                    onClick={loadData}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={clearError}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * No Data State
   */
  if (!statistics || !statisticalAnalysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
              <BarChart3 className="h-16 w-16 text-gray-400" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Comparison Data Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Run some AI vs Baseline comparisons to see analysis results
                  here.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Minimum 2 comparisons required for statistical analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Main Dashboard
   */
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Comparison Analysis Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-Powered System vs Rule-Based Baseline Comparison
        </p>
      </div>

      {/* Export Controls & Filters */}
      <ExportControls
        statistics={statistics}
        analysis={statisticalAnalysis}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Overview Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Overview
        </h2>
        <ComparisonOverview statistics={statistics} />
      </section>

      {/* Visualizations Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Visualizations
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Score Comparison Chart */}
          <ScoreComparisonChart statistics={statistics} />

          {/* Win Rate Chart */}
          <WinRateChart statistics={statistics} />
        </div>
      </section>

      {/* Statistical Analysis Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Statistical Significance Analysis
        </h2>
        <StatisticalSignificancePanel analysis={statisticalAnalysis} />
      </section>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Last updated: {new Date().toLocaleString()} | Total comparisons
          analyzed: {statistics.totalComparisons}
        </p>
      </div>
    </div>
  );
}
