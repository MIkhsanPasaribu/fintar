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
    primary: "text-primary-300 bg-primary-500/20 border-primary-500/30",
    secondary: "text-secondary-300 bg-secondary-500/20 border-secondary-500/30",
    accent: "text-accent-300 bg-accent-500/20 border-accent-500/30",
    warning: "text-orange-300 bg-orange-500/20 border-orange-500/30",
  };

  return (
    <Card className="glass-effect border-primary-500/20 card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-font-secondary">{title}</p>
            <p className="text-2xl font-bold text-font-light">{value}</p>
            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success-light" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error-light" />
                )}
                <span
                  className={`text-sm font-medium ${
                    change >= 0 ? "text-success-light" : "text-error-light"
                  }`}
                >
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-sm text-font-muted">dari bulan lalu</span>
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-xl border neon-glow ${colorClasses[color]}`}
          >
            {icon}
          </div>
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
        <h1 className="text-3xl font-bold text-font-light">
          {getGreeting()}, {user?.name || "User"}! 👋
        </h1>
        <p className="text-font-secondary text-lg">
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
      <Card className="glass-effect border-primary-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-font-light">
            <Target className="h-5 w-5 text-primary-400" />
            <span>Penggunaan Budget</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.budgetUsage.map((budget, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-font-light">
                    {budget.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-font-secondary">
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.limit)}
                    </span>
                    {budget.percentage > 90 && (
                      <AlertCircle className="h-4 w-4 text-error-light" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-bg-darker/50 rounded-full h-3 border border-primary-500/20">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      budget.percentage > 90
                        ? "bg-gradient-to-r from-error-dark to-error-light"
                        : budget.percentage > 70
                        ? "bg-gradient-to-r from-accent-500 to-accent-400"
                        : "bg-gradient-to-r from-secondary-500 to-secondary-400"
                    }`}
                    data-progress={Math.min(budget.percentage, 100)}
                  />
                </div>
                <div className="text-xs text-font-muted text-right">
                  {budget.percentage}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card className="glass-effect border-primary-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-font-light">
            <Target className="h-5 w-5 text-primary-400" />
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
                  className="p-4 glass-effect border border-primary-500/20 rounded-xl space-y-3 card-hover"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-font-light">
                      {goal.title}
                    </h4>
                    <p className="text-sm text-font-secondary">
                      {formatCurrency(goal.currentAmount)} /{" "}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-font-secondary">Progress</span>
                      <span className="text-primary-300 font-medium">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-bg-darker/50 rounded-full h-3 border border-primary-500/20">
                      <div
                        className={`h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700 neon-glow`}
                        data-progress={progress}
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
