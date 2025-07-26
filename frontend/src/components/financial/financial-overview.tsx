"use client";

import React from "react";
import { Card } from "@/components/ui/kartu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/tombol";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  CreditCard,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
} from "lucide-react";

interface FinancialMetric {
  id: string;
  label: string;
  value: number;
  currency: string;
  change?: {
    value: number;
    percentage: number;
    period: string;
  };
  trend: "UP" | "DOWN" | "STABLE";
  category:
    | "INCOME"
    | "EXPENSE"
    | "INVESTMENT"
    | "DEBT"
    | "ASSET"
    | "LIABILITY";
}

interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: Date;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "ON_TRACK" | "BEHIND" | "ACHIEVED";
}

interface FinancialOverviewProps {
  metrics?: FinancialMetric[];
  goals?: FinancialGoal[];
  period?: "WEEKLY" | "MONTHLY" | "YEARLY";
  onPeriodChange?: (period: "WEEKLY" | "MONTHLY" | "YEARLY") => void;
}

const mockMetrics: FinancialMetric[] = [
  {
    id: "1",
    label: "Total Pendapatan",
    value: 15000000,
    currency: "IDR",
    change: { value: 2000000, percentage: 15.38, period: "bulan ini" },
    trend: "UP",
    category: "INCOME",
  },
  {
    id: "2",
    label: "Total Pengeluaran",
    value: 8500000,
    currency: "IDR",
    change: { value: -500000, percentage: -5.56, period: "bulan ini" },
    trend: "DOWN",
    category: "EXPENSE",
  },
  {
    id: "3",
    label: "Total Investasi",
    value: 25000000,
    currency: "IDR",
    change: { value: 1500000, percentage: 6.38, period: "bulan ini" },
    trend: "UP",
    category: "INVESTMENT",
  },
  {
    id: "4",
    label: "Total Utang",
    value: 5000000,
    currency: "IDR",
    change: { value: -1000000, percentage: -16.67, period: "bulan ini" },
    trend: "DOWN",
    category: "DEBT",
  },
];

const mockGoals: FinancialGoal[] = [
  {
    id: "1",
    title: "Dana Darurat",
    description: "Mengumpulkan dana darurat untuk 6 bulan pengeluaran",
    targetAmount: 50000000,
    currentAmount: 35000000,
    currency: "IDR",
    deadline: new Date("2024-12-31"),
    category: "Emergency Fund",
    priority: "HIGH",
    status: "ON_TRACK",
  },
  {
    id: "2",
    title: "Rumah Idaman",
    description: "Down payment untuk rumah impian",
    targetAmount: 200000000,
    currentAmount: 75000000,
    currency: "IDR",
    deadline: new Date("2025-06-30"),
    category: "Property",
    priority: "HIGH",
    status: "BEHIND",
  },
  {
    id: "3",
    title: "Liburan Keluarga",
    description: "Liburan ke Jepang untuk keluarga",
    targetAmount: 30000000,
    currentAmount: 28000000,
    currency: "IDR",
    deadline: new Date("2024-08-15"),
    category: "Lifestyle",
    priority: "MEDIUM",
    status: "ON_TRACK",
  },
];

export function FinancialOverview({
  metrics = mockMetrics,
  goals = mockGoals,
  period = "MONTHLY",
  onPeriodChange,
}: FinancialOverviewProps) {
  const formatCurrency = (amount: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getMetricIcon = (category: FinancialMetric["category"]) => {
    switch (category) {
      case "INCOME":
        return <TrendingUp className="h-5 w-5 text-success" />;
      case "EXPENSE":
        return <TrendingDown className="h-5 w-5 text-danger" />;
      case "INVESTMENT":
        return <BarChart3 className="h-5 w-5 text-info" />;
      case "DEBT":
        return <CreditCard className="h-5 w-5 text-warning" />;
      case "ASSET":
        return <PiggyBank className="h-5 w-5 text-success" />;
      case "LIABILITY":
        return <AlertTriangle className="h-5 w-5 text-danger" />;
      default:
        return <DollarSign className="h-5 w-5 text-neutral-500" />;
    }
  };

  const getTrendIcon = (trend: FinancialMetric["trend"]) => {
    switch (trend) {
      case "UP":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "DOWN":
        return <TrendingDown className="h-4 w-4 text-danger" />;
      case "STABLE":
        return <div className="h-4 w-4 rounded-full bg-neutral-400" />;
      default:
        return null;
    }
  };

  const getGoalStatusIcon = (status: FinancialGoal["status"]) => {
    switch (status) {
      case "ON_TRACK":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "BEHIND":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "ACHIEVED":
        return <Target className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  const getGoalStatusColor = (status: FinancialGoal["status"]) => {
    switch (status) {
      case "ON_TRACK":
        return "bg-success-100 text-success-700";
      case "BEHIND":
        return "bg-warning-100 text-warning-700";
      case "ACHIEVED":
        return "bg-success-100 text-success-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getPriorityColor = (priority: FinancialGoal["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "bg-danger-100 text-danger-700";
      case "MEDIUM":
        return "bg-warning-100 text-warning-700";
      case "LOW":
        return "bg-neutral-100 text-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          Financial Overview
        </h1>
        <div className="flex items-center gap-2">
          {(["WEEKLY", "MONTHLY", "YEARLY"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange?.(p)}
            >
              {p === "WEEKLY"
                ? "Mingguan"
                : p === "MONTHLY"
                ? "Bulanan"
                : "Tahunan"}
            </Button>
          ))}
        </div>
      </div>

      {/* Financial Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Metrik Keuangan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id} className="p-6">
              <div className="flex items-center justify-between mb-2">
                {getMetricIcon(metric.category)}
                {getTrendIcon(metric.trend)}
              </div>

              <h3 className="text-sm font-medium text-text-metadata mb-1">
                {metric.label}
              </h3>

              <p className="text-2xl font-bold text-text-primary mb-2">
                {formatCurrency(metric.value, metric.currency)}
              </p>

              {metric.change && (
                <div className="flex items-center gap-1 text-sm">
                  <span
                    className={`font-medium ${
                      metric.change.percentage > 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {formatPercentage(metric.change.percentage)}
                  </span>
                  <span className="text-text-metadata">
                    {metric.change.period}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Financial Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Target Keuangan
          </h2>
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Tambah Target
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(
              goal.currentAmount,
              goal.targetAmount
            );
            const daysRemaining = calculateDaysRemaining(goal.deadline);

            return (
              <Card key={goal.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">
                        {goal.title}
                      </h3>
                      {getGoalStatusIcon(goal.status)}
                    </div>
                    <p className="text-sm text-text-description mb-2">
                      {goal.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getGoalStatusColor(goal.status)}
                      >
                        {goal.status === "ON_TRACK"
                          ? "On Track"
                          : goal.status === "BEHIND"
                          ? "Behind"
                          : "Achieved"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(goal.priority)}
                      >
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-metadata">Progress</span>
                    <span className="font-medium text-text-primary">
                      {progress.toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-text-metadata">
                      {formatCurrency(goal.currentAmount, goal.currency)}
                    </span>
                    <span className="font-medium text-text-primary">
                      {formatCurrency(goal.targetAmount, goal.currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                    <div className="flex items-center gap-1 text-sm text-text-metadata">
                      <Calendar className="h-3 w-3" />
                      {daysRemaining > 0
                        ? `${daysRemaining} hari lagi`
                        : "Overdue"}
                    </div>
                    <div className="text-sm font-medium text-text-primary">
                      {formatCurrency(
                        goal.targetAmount - goal.currentAmount,
                        goal.currency
                      )}{" "}
                      tersisa
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-text-primary mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-16 flex-col">
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs">Tambah Pendapatan</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <TrendingDown className="h-5 w-5 mb-1" />
            <span className="text-xs">Catat Pengeluaran</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Update Investasi</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <Target className="h-5 w-5 mb-1" />
            <span className="text-xs">Review Target</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
