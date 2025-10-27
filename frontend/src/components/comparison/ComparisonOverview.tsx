/**
 * ComparisonOverview Component
 *
 * Displays summary cards comparing AI vs Baseline system metrics
 * Shows: Mean, Median, Standard Deviation, Sample Size, Win Rate
 *
 * @author Fintar Team
 */

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  BarChart3,
} from "lucide-react";
import type { ComparisonStatistics } from "@/hooks/useComparison";

interface ComparisonOverviewProps {
  statistics: ComparisonStatistics;
}

/**
 * Format number to 2 decimal places
 */
const formatNumber = (num: number): string => {
  return num.toFixed(2);
};

/**
 * Get trend icon based on comparison
 */
const getTrendIcon = (aiValue: number, baselineValue: number) => {
  if (aiValue > baselineValue) {
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  } else if (aiValue < baselineValue) {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-gray-500" />;
};

/**
 * Metric Card Component
 */
const MetricCard: React.FC<{
  title: string;
  aiValue: number;
  baselineValue: number;
  unit?: string;
  showTrend?: boolean;
}> = ({ title, aiValue, baselineValue, unit = "", showTrend = true }) => {
  const difference = aiValue - baselineValue;
  const percentDiff =
    baselineValue !== 0 ? (difference / baselineValue) * 100 : 0;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h4>

      {/* AI System */}
      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            AI System
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            {formatNumber(aiValue)}
            {unit}
          </p>
        </div>
        {showTrend && (
          <div className="flex items-center gap-1">
            {getTrendIcon(aiValue, baselineValue)}
          </div>
        )}
      </div>

      {/* Baseline System */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Baseline
          </p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {formatNumber(baselineValue)}
            {unit}
          </p>
        </div>
      </div>

      {/* Difference */}
      {showTrend && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Difference:</span>
          <span
            className={
              difference > 0
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {difference > 0 ? "+" : ""}
            {formatNumber(difference)}
            {unit} ({formatNumber(percentDiff)}%)
          </span>
        </div>
      )}
    </div>
  );
};

export function ComparisonOverview({ statistics }: ComparisonOverviewProps) {
  const aiWinPercentage =
    (statistics.aiWins / statistics.totalComparisons) * 100;
  const baselineWinPercentage =
    (statistics.baselineWins / statistics.totalComparisons) * 100;
  const tiePercentage = (statistics.ties / statistics.totalComparisons) * 100;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Overall Summary Card */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparison Summary
          </CardTitle>
          <CardDescription>
            Total comparisons: {statistics.totalComparisons}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* AI Wins */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Trophy className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                {statistics.aiWins}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                AI Wins ({formatNumber(aiWinPercentage)}%)
              </p>
            </div>

            {/* Baseline Wins */}
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Trophy className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                {statistics.baselineWins}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Baseline Wins ({formatNumber(baselineWinPercentage)}%)
              </p>
            </div>

            {/* Ties */}
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Minus className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                {statistics.ties}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ties ({formatNumber(tiePercentage)}%)
              </p>
            </div>
          </div>

          {/* Win Rate Badge */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              AI Win Rate:
            </span>
            <Badge
              variant={statistics.aiWinRate >= 0.7 ? "default" : "secondary"}
              className="text-lg px-3 py-1"
            >
              {formatNumber(statistics.aiWinRate * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mean Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mean Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricCard
            title="Average Performance"
            aiValue={statistics.averageScores.ai.overall}
            baselineValue={statistics.averageScores.baseline.overall}
          />
        </CardContent>
      </Card>

      {/* Median Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Median Score</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricCard
            title="Middle Value"
            aiValue={statistics.medianScores.ai}
            baselineValue={statistics.medianScores.baseline}
          />
        </CardContent>
      </Card>

      {/* Standard Deviation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Standard Deviation</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricCard
            title="Consistency"
            aiValue={statistics.standardDeviations.ai}
            baselineValue={statistics.standardDeviations.baseline}
            showTrend={false}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Lower = More Consistent
          </p>
        </CardContent>
      </Card>

      {/* Sample Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sample Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Total Comparisons
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                {statistics.totalComparisons}
              </p>
            </div>
            {statistics.totalComparisons >= 30 ? (
              <Badge variant="default" className="w-full justify-center">
                ✓ Sufficient for Statistical Analysis
              </Badge>
            ) : (
              <Badge variant="secondary" className="w-full justify-center">
                ⚠ Need {30 - statistics.totalComparisons} more for robust
                analysis
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Criteria Breakdown */}
      <Card className="col-span-full lg:col-span-2 xl:col-span-4">
        <CardHeader>
          <CardTitle>Criteria Breakdown</CardTitle>
          <CardDescription>
            Average scores by evaluation criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {/* Accuracy */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Accuracy
              </h5>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.ai.accuracy}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {formatNumber(statistics.averageScores.ai.accuracy)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-500 dark:bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.baseline.accuracy}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {formatNumber(statistics.averageScores.baseline.accuracy)}
                </span>
              </div>
            </div>

            {/* Relevance */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Relevance
              </h5>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.ai.relevance}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {formatNumber(statistics.averageScores.ai.relevance)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-500 dark:bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.baseline.relevance}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {formatNumber(statistics.averageScores.baseline.relevance)}
                </span>
              </div>
            </div>

            {/* Actionability */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Actionability
              </h5>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.ai.actionability}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {formatNumber(statistics.averageScores.ai.actionability)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-500 dark:bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.baseline.actionability}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {formatNumber(
                    statistics.averageScores.baseline.actionability
                  )}
                </span>
              </div>
            </div>

            {/* Clarity */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Clarity
              </h5>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{ width: `${statistics.averageScores.ai.clarity}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {formatNumber(statistics.averageScores.ai.clarity)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-500 dark:bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.baseline.clarity}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {formatNumber(statistics.averageScores.baseline.clarity)}
                </span>
              </div>
            </div>

            {/* Completeness */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Completeness
              </h5>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.ai.completeness}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {formatNumber(statistics.averageScores.ai.completeness)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-500 dark:bg-gray-400 h-2 rounded-full"
                    style={{
                      width: `${statistics.averageScores.baseline.completeness}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {formatNumber(statistics.averageScores.baseline.completeness)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-green-600 dark:bg-green-500 rounded-full" />
              <span>AI System</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-gray-500 dark:bg-gray-400 rounded-full" />
              <span>Baseline System</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComparisonOverview;
