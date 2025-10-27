/**
 * ExportControls Component
 *
 * Provides export functionality for comparison data
 * - CSV export (for Excel/SPSS/R analysis)
 * - JSON export (for programmatic access)
 * - Date range filtering
 *
 * @author Fintar Team
 */

"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileJson, FileSpreadsheet, Calendar } from "lucide-react";
import type {
  ComparisonStatistics,
  StatisticalAnalysisResult,
} from "@/hooks/useComparison";

interface ExportControlsProps {
  statistics: ComparisonStatistics | null;
  analysis: StatisticalAnalysisResult | null;
  onDateRangeChange?: (
    startDate: string | null,
    endDate: string | null
  ) => void;
}

export function ExportControls({
  statistics,
  analysis,
  onDateRangeChange,
}: ExportControlsProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  /**
   * Export data to CSV format
   */
  const handleExportCSV = () => {
    if (!statistics || !analysis) {
      alert("No data available to export");
      return;
    }

    const csvLines = [
      "Category,Metric,AI System,Baseline System",
      "",
      "=== DESCRIPTIVE STATISTICS ===",
      `Sample Size,Count,${analysis.aiSampleSize},${analysis.baselineSampleSize}`,
      `Mean,Overall Score,${analysis.aiMean},${analysis.baselineMean}`,
      `Median,Overall Score,${analysis.aiMedian},${analysis.baselineMedian}`,
      `Standard Deviation,Overall Score,${analysis.aiStdDev},${analysis.baselineStdDev}`,
      "",
      "=== CRITERIA SCORES (MEAN) ===",
      `Accuracy,Score,${statistics.averageScores.ai.accuracy},${statistics.averageScores.baseline.accuracy}`,
      `Relevance,Score,${statistics.averageScores.ai.relevance},${statistics.averageScores.baseline.relevance}`,
      `Actionability,Score,${statistics.averageScores.ai.actionability},${statistics.averageScores.baseline.actionability}`,
      `Clarity,Score,${statistics.averageScores.ai.clarity},${statistics.averageScores.baseline.clarity}`,
      `Completeness,Score,${statistics.averageScores.ai.completeness},${statistics.averageScores.baseline.completeness}`,
      "",
      "=== WIN RATE ===",
      `AI Wins,Count,${statistics.aiWins},`,
      `Baseline Wins,Count,${statistics.baselineWins},`,
      `Ties,Count,${statistics.ties},`,
      `AI Win Rate,Percentage,${(statistics.aiWinRate * 100).toFixed(2)}%,`,
      "",
      "=== STATISTICAL TESTS ===",
      `T-Test,t-statistic,${analysis.tTest.tStatistic},`,
      `T-Test,Degrees of Freedom,${analysis.tTest.degreesOfFreedom},`,
      `T-Test,p-value,${analysis.tTest.pValue},`,
      `T-Test,Significant (α=0.05),${
        analysis.tTest.isSignificant ? "Yes" : "No"
      },`,
      `Effect Size,Cohen's d,${analysis.effectSize.cohensD},`,
      `Effect Size,Interpretation,${analysis.effectSize.interpretation},`,
      "",
      "=== CONFIDENCE INTERVALS (95%) ===",
      `AI Mean,Lower Bound,${analysis.aiConfidenceInterval.lower},`,
      `AI Mean,Upper Bound,${analysis.aiConfidenceInterval.upper},`,
      `Baseline Mean,Lower Bound,${analysis.baselineConfidenceInterval.lower},`,
      `Baseline Mean,Upper Bound,${analysis.baselineConfidenceInterval.upper},`,
      `Mean Difference,Lower Bound,${analysis.meanDifferenceCI.lower},`,
      `Mean Difference,Upper Bound,${analysis.meanDifferenceCI.upper},`,
      "",
      "=== METADATA ===",
      `Total Comparisons,,${statistics.totalComparisons},`,
      `Export Date,,${new Date().toISOString()},`,
      `Date Range Start,,${analysis.dataRange?.startDate || "N/A"},`,
      `Date Range End,,${analysis.dataRange?.endDate || "N/A"},`,
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `comparison-analysis-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Export data to JSON format
   */
  const handleExportJSON = () => {
    if (!statistics || !analysis) {
      alert("No data available to export");
      return;
    }

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalComparisons: statistics.totalComparisons,
        dateRange: analysis.dataRange || { startDate: null, endDate: null },
      },
      descriptiveStatistics: {
        aiSystem: {
          sampleSize: analysis.aiSampleSize,
          mean: analysis.aiMean,
          median: analysis.aiMedian,
          stdDev: analysis.aiStdDev,
          confidenceInterval95: analysis.aiConfidenceInterval,
        },
        baselineSystem: {
          sampleSize: analysis.baselineSampleSize,
          mean: analysis.baselineMean,
          median: analysis.baselineMedian,
          stdDev: analysis.baselineStdDev,
          confidenceInterval95: analysis.baselineConfidenceInterval,
        },
        meanDifference: {
          value: analysis.meanDifference,
          confidenceInterval95: analysis.meanDifferenceCI,
        },
      },
      criteriaScores: {
        ai: statistics.averageScores.ai,
        baseline: statistics.averageScores.baseline,
      },
      winRate: {
        aiWins: statistics.aiWins,
        baselineWins: statistics.baselineWins,
        ties: statistics.ties,
        aiWinRate: statistics.aiWinRate,
      },
      statisticalTests: {
        tTest: analysis.tTest,
        effectSize: analysis.effectSize,
      },
      conclusion: analysis.conclusion,
      journalStatement: analysis.journalStatement,
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `comparison-analysis-${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Handle date range change
   */
  const handleApplyDateRange = () => {
    if (onDateRangeChange) {
      onDateRangeChange(startDate || null, endDate || null);
    }
  };

  /**
   * Clear date range filter
   */
  const handleClearDateRange = () => {
    setStartDate("");
    setEndDate("");
    if (onDateRangeChange) {
      onDateRangeChange(null, null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Filtering
        </CardTitle>
        <CardDescription>
          Export comparison data or filter by date range
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Date Range Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Date Range Filter
              </h4>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyDateRange}
                disabled={!startDate && !endDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Apply Filter
              </button>
              <button
                onClick={handleClearDateRange}
                disabled={!startDate && !endDate}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Filter
              </button>
            </div>

            {(startDate || endDate) && (
              <Badge variant="secondary" className="text-sm">
                Filtered: {startDate || "All"} to {endDate || "All"}
              </Badge>
            )}
          </div>

          {/* Export Buttons */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Export Data
            </h4>

            <div className="grid gap-3 md:grid-cols-2">
              {/* CSV Export */}
              <button
                onClick={handleExportCSV}
                disabled={!statistics || !analysis}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <FileSpreadsheet className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold">Export to CSV</p>
                  <p className="text-xs opacity-90">For Excel, SPSS, R</p>
                </div>
              </button>

              {/* JSON Export */}
              <button
                onClick={handleExportJSON}
                disabled={!statistics || !analysis}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <FileJson className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold">Export to JSON</p>
                  <p className="text-xs opacity-90">For programmatic access</p>
                </div>
              </button>
            </div>
          </div>

          {/* Export Info */}
          {statistics && analysis && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Data available for export:</strong>{" "}
                {statistics.totalComparisons} comparisons
                {analysis.dataRange && (
                  <>
                    {" "}
                    from {analysis.dataRange.startDate} to{" "}
                    {analysis.dataRange.endDate}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExportControls;
