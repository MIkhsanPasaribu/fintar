"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PerformanceMetrics,
  DailyMetrics,
} from "@/components/analytics/AnalyticsTypes";
import { PerformanceOverview } from "@/components/analytics/PerformanceOverview";
import { ResponseTimeChart } from "@/components/analytics/ResponseTimeChart";
import { TokenUsageChart } from "@/components/analytics/TokenUsageChart";
import { SuccessRateChart } from "@/components/analytics/SuccessRateChart";
import { QualityScoresChart } from "@/components/analytics/QualityScoresChart";
import { ErrorDistributionChart } from "@/components/analytics/ErrorDistributionChart";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics[]>([]);

  // Date range state (default: last 7 days)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      // Fetch performance metrics
      const perfResponse = await fetch(
        `${baseUrl}/api/analytics/performance?startDate=${dateRange.startDate.toISOString()}&endDate=${dateRange.endDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!perfResponse.ok) {
        throw new Error("Failed to fetch performance metrics");
      }

      const perfData = await perfResponse.json();
      setPerformanceMetrics(perfData);

      // Fetch daily metrics
      const dailyResponse = await fetch(
        `${baseUrl}/api/analytics/daily?startDate=${dateRange.startDate.toISOString()}&endDate=${dateRange.endDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!dailyResponse.ok) {
        throw new Error("Failed to fetch daily metrics");
      }

      const dailyData = await dailyResponse.json();
      setDailyMetrics(dailyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">
              Error Loading Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAnalytics}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">📊 Performance Analytics</h1>
          <p className="text-gray-600 mt-1">
            AI system performance metrics and insights
          </p>
        </div>

        {/* Date Range Picker */}
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={setDateRange}
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Overview Cards */}
          {performanceMetrics && (
            <PerformanceOverview metrics={performanceMetrics} />
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Trend */}
            {dailyMetrics.length > 0 && (
              <ResponseTimeChart data={dailyMetrics} />
            )}

            {/* Success Rate */}
            {performanceMetrics && (
              <SuccessRateChart metrics={performanceMetrics.successRate} />
            )}

            {/* Token Usage */}
            {performanceMetrics && (
              <TokenUsageChart metrics={performanceMetrics.tokenUsage} />
            )}

            {/* Quality Scores */}
            {performanceMetrics && (
              <QualityScoresChart metrics={performanceMetrics.qualityScores} />
            )}
          </div>

          {/* Error Distribution */}
          {performanceMetrics && performanceMetrics.errors.length > 0 && (
            <ErrorDistributionChart errors={performanceMetrics.errors} />
          )}
        </>
      )}
    </div>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
