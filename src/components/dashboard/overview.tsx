"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  getGreeting,
  calculatePercentageChange,
} from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Target,
  AlertCircle,
} from "lucide-react";
import { useDashboardStore, useUserStore } from "@/store";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "accent" | "warning";
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-100",
    secondary: "text-secondary-600 bg-secondary-100",
    accent: "text-accent-600 bg-accent-100",
    warning: "text-orange-600 bg-orange-100",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error" />
                )}
                <span
                  className={`text-sm font-medium ${
                    change >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-sm text-neutral-500">
                  dari bulan lalu
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const { user } = useUserStore();
  const { dashboardData } = useDashboardStore();

  // Mock data for demonstration
  const mockData = {
    totalIncome: 15000000,
    totalExpenses: 8500000,
    balance: 6500000,
    monthlyIncome: 5000000,
    monthlyExpenses: 3200000,
    previousMonthIncome: 4800000,
    previousMonthExpenses: 3500000,
    budgetUsage: [
      { category: "Makanan", limit: 1500000, spent: 1200000, percentage: 80 },
      {
        category: "Transportasi",
        limit: 800000,
        spent: 650000,
        percentage: 81,
      },
      { category: "Hiburan", limit: 500000, spent: 320000, percentage: 64 },
      { category: "Kesehatan", limit: 600000, spent: 180000, percentage: 30 },
    ],
    financialGoals: [
      {
        title: "Dana Darurat",
        targetAmount: 20000000,
        currentAmount: 12000000,
      },
      { title: "Liburan", targetAmount: 8000000, currentAmount: 3200000 },
      { title: "Investasi", targetAmount: 50000000, currentAmount: 15000000 },
    ],
  };

  const data = dashboardData || mockData;
  const incomeChange = calculatePercentageChange(
    data.monthlyIncome,
    mockData.previousMonthIncome
  );
  const expenseChange = calculatePercentageChange(
    data.monthlyExpenses,
    mockData.previousMonthExpenses
  );

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">
          {getGreeting()}, {user?.name || "User"}! 👋
        </h1>
        <p className="text-neutral-600">
          Berikut adalah ringkasan keuangan Anda hari ini
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Saldo"
          value={formatCurrency(data.balance)}
          icon={<Wallet className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value={formatCurrency(data.monthlyIncome)}
          change={incomeChange}
          icon={<TrendingUp className="h-6 w-6" />}
          color="secondary"
        />
        <StatCard
          title="Pengeluaran Bulan Ini"
          value={formatCurrency(data.monthlyExpenses)}
          change={expenseChange}
          icon={<TrendingDown className="h-6 w-6" />}
          color="warning"
        />
        <StatCard
          title="Tabungan"
          value={formatCurrency(data.monthlyIncome - data.monthlyExpenses)}
          icon={<PiggyBank className="h-6 w-6" />}
          color="accent"
        />
      </div>

      {/* Budget Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Penggunaan Budget</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.budgetUsage.map((budget, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-700">
                    {budget.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.limit)}
                    </span>
                    {budget.percentage > 90 && (
                      <AlertCircle className="h-4 w-4 text-error" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budget.percentage > 90
                        ? "bg-error"
                        : budget.percentage > 70
                        ? "bg-accent-500"
                        : "bg-secondary-500"
                    }`}
                    style={{
                      width: `${Math.min(budget.percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Target Keuangan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.financialGoals.map((goal, index) => {
              const progress = Math.round(
                (goal.currentAmount / goal.targetAmount) * 100
              );
              return (
                <div
                  key={index}
                  className="p-4 border border-neutral-200 rounded-lg space-y-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-neutral-900">
                      {goal.title}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {formatCurrency(goal.currentAmount)} /{" "}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className={`h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
