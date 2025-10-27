/**
 * WinRateChart Component
 *
 * Recharts PieChart displaying AI vs Baseline vs Ties win distribution
 * Shows percentage labels and counts
 *
 * @author Fintar Team
 */

"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ComparisonStatistics } from "@/hooks/useComparison";

interface WinRateChartProps {
  statistics: ComparisonStatistics;
}

// Colors for pie slices
const COLORS = {
  aiWins: "#16a34a", // Green
  baselineWins: "#dc2626", // Red
  ties: "#eab308", // Yellow
};

/**
 * Custom Label Component
 */
const renderCustomLabel = (entry: any) => {
  return `${entry.percentage.toFixed(1)}%`;
};

/**
 * Custom Tooltip Component
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {data.name}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Count:
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {data.value}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Percentage:
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {data.percentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function WinRateChart({ statistics }: WinRateChartProps) {
  // Prepare data for pie chart
  const total = statistics.totalComparisons;
  const chartData = [
    {
      name: "AI Wins",
      value: statistics.aiWins,
      percentage: (statistics.aiWins / total) * 100,
      color: COLORS.aiWins,
    },
    {
      name: "Baseline Wins",
      value: statistics.baselineWins,
      percentage: (statistics.baselineWins / total) * 100,
      color: COLORS.baselineWins,
    },
    {
      name: "Ties",
      value: statistics.ties,
      percentage: (statistics.ties / total) * 100,
      color: COLORS.ties,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Win Rate Distribution</CardTitle>
        <CardDescription>
          Breakdown of comparison outcomes (n = {statistics.totalComparisons})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => {
                const item = chartData.find((d) => d.name === value);
                return `${value} (${item?.value})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {/* AI Wins */}
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500 dark:border-green-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              AI Wins
            </p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">
              {statistics.aiWins}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {chartData[0].percentage.toFixed(1)}% of total
            </p>
          </div>

          {/* Baseline Wins */}
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-500 dark:border-red-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Baseline Wins
            </p>
            <p className="text-3xl font-bold text-red-700 dark:text-red-400">
              {statistics.baselineWins}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {chartData[1].percentage.toFixed(1)}% of total
            </p>
          </div>

          {/* Ties */}
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-500 dark:border-yellow-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Ties
            </p>
            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
              {statistics.ties}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {chartData[2].percentage.toFixed(1)}% of total
            </p>
          </div>
        </div>

        {/* Win Rate Interpretation */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Interpretation
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {statistics.aiWinRate >= 0.9 && (
              <>
                <strong>Exceptional Performance:</strong> The AI system wins in
                over 90% of comparisons, demonstrating strong superiority over
                the baseline system.
              </>
            )}
            {statistics.aiWinRate >= 0.7 && statistics.aiWinRate < 0.9 && (
              <>
                <strong>Strong Performance:</strong> The AI system significantly
                outperforms the baseline in the majority of cases (70-90% win
                rate).
              </>
            )}
            {statistics.aiWinRate >= 0.5 && statistics.aiWinRate < 0.7 && (
              <>
                <strong>Moderate Performance:</strong> The AI system shows
                better results than baseline but with room for improvement
                (50-70% win rate).
              </>
            )}
            {statistics.aiWinRate < 0.5 && (
              <>
                <strong>Needs Improvement:</strong> The AI system does not
                consistently outperform the baseline (&lt;50% win rate). Further
                optimization required.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default WinRateChart;
