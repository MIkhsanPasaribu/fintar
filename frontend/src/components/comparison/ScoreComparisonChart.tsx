/**
 * ScoreComparisonChart Component
 *
 * Recharts BarChart displaying AI vs Baseline scores by criteria
 * Shows: Accuracy, Relevance, Actionability, Clarity, Completeness
 *
 * @author Fintar Team
 */

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ComparisonStatistics } from "@/hooks/useComparison";

interface ScoreComparisonChartProps {
  statistics: ComparisonStatistics;
}

/**
 * Custom Tooltip Component
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {payload[0].payload.name}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {entry.name}:
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {entry.value.toFixed(2)}
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Difference: {(payload[0].value - payload[1].value).toFixed(2)}{" "}
            points
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function ScoreComparisonChart({
  statistics,
}: ScoreComparisonChartProps) {
  // Prepare data for chart
  const chartData = [
    {
      name: "Accuracy",
      AI: statistics.averageScores.ai.accuracy,
      Baseline: statistics.averageScores.baseline.accuracy,
    },
    {
      name: "Relevance",
      AI: statistics.averageScores.ai.relevance,
      Baseline: statistics.averageScores.baseline.relevance,
    },
    {
      name: "Actionability",
      AI: statistics.averageScores.ai.actionability,
      Baseline: statistics.averageScores.baseline.actionability,
    },
    {
      name: "Clarity",
      AI: statistics.averageScores.ai.clarity,
      Baseline: statistics.averageScores.baseline.clarity,
    },
    {
      name: "Completeness",
      AI: statistics.averageScores.ai.completeness,
      Baseline: statistics.averageScores.baseline.completeness,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Comparison by Criteria</CardTitle>
        <CardDescription>
          Average scores (0-100) for each evaluation criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "currentColor" }}
              className="text-gray-600 dark:text-gray-400"
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "currentColor" }}
              className="text-gray-600 dark:text-gray-400"
              label={{
                value: "Score",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "currentColor" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
              iconType="rect"
            />
            <Bar
              dataKey="AI"
              fill="#16a34a"
              radius={[8, 8, 0, 0]}
              name="AI System"
            />
            <Bar
              dataKey="Baseline"
              fill="#6b7280"
              radius={[8, 8, 0, 0]}
              name="Baseline System"
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {chartData.map((item) => {
            const difference = item.AI - item.Baseline;
            const isPositive = difference > 0;

            return (
              <div
                key={item.name}
                className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {item.name}
                </p>
                <p
                  className={`text-lg font-bold ${
                    isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {difference.toFixed(1)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span>AI System</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded" />
            <span>Baseline System</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScoreComparisonChart;
