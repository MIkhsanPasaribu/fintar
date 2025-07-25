/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardBody, Button, LoadingSpinner } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { financialApi, chatApi } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

const WalletIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const PiggyBankIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  monthlyGrowth: number;
  financialHealthScore: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  amount?: number;
  date: Date;
}

export default function DashboardPage() {
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get user data
      const userData = localStorage.getItem("user_data");
      if (!userData) {
        throw new Error("User not logged in");
      }

      const user = JSON.parse(userData);

      // Fetch financial summary
      const summaryResponse = await financialApi.getFinancialSummary(user.id);
      const defaultStats: DashboardStats = {
        totalIncome: 12000000,
        totalExpenses: 8500000,
        totalSavings: 3500000,
        totalInvestments: 15000000,
        monthlyGrowth: 8.5,
        financialHealthScore: 75,
      };
      
      setStats(
        summaryResponse.data && typeof summaryResponse.data === 'object' && 
        'totalIncome' in summaryResponse.data ? summaryResponse.data as DashboardStats : defaultStats
      );

      // Simulate recent activities
      setRecentActivities([
        {
          id: "1",
          type: "INCOME",
          description: "Gaji bulanan diterima",
          amount: 12000000,
          date: new Date(),
        },
        {
          id: "2",
          type: "INVESTMENT",
          description: "Investasi reksadana",
          amount: 2000000,
          date: new Date(Date.now() - 86400000),
        },
        {
          id: "3",
          type: "EXPENSE",
          description: "Tagihan listrik dan air",
          amount: 850000,
          date: new Date(Date.now() - 172800000),
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      addToast({
        title: "Error",
        description: "Gagal memuat data dashboard",
        variant: "danger",
      });

      // Fallback data
      setStats({
        totalIncome: 12000000,
        totalExpenses: 8500000,
        totalSavings: 3500000,
        totalInvestments: 15000000,
        monthlyGrowth: 8.5,
        financialHealthScore: 75,
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-danger";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "INCOME":
        return <TrendingUpIcon />;
      case "EXPENSE":
        return <WalletIcon />;
      case "INVESTMENT":
        return <ChartIcon />;
      default:
        return <WalletIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "INCOME":
        return "text-success";
      case "EXPENSE":
        return "text-danger";
      case "INVESTMENT":
        return "text-primary";
      default:
        return "text-text-metadata";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Dashboard Keuangan
            </h1>
            <p className="text-text-description">
              Ringkasan keuangan dan aktivitas terbaru Anda
            </p>
          </motion.div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardBody className="flex items-center space-x-4">
                <div className="p-3 bg-success-100 rounded-lg">
                  <TrendingUpIcon />
                </div>
                <div>
                  <p className="text-sm text-text-metadata">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(stats?.totalIncome || 0)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardBody className="flex items-center space-x-4">
                <div className="p-3 bg-danger-100 rounded-lg">
                  <WalletIcon />
                </div>
                <div>
                  <p className="text-sm text-text-metadata">
                    Total Pengeluaran
                  </p>
                  <p className="text-2xl font-bold text-danger">
                    {formatCurrency(stats?.totalExpenses || 0)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardBody className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <PiggyBankIcon />
                </div>
                <div>
                  <p className="text-sm text-text-metadata">Total Tabungan</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(stats?.totalSavings || 0)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardBody className="flex items-center space-x-4">
                <div className="p-3 bg-accent-100 rounded-lg">
                  <ChartIcon />
                </div>
                <div>
                  <p className="text-sm text-text-metadata">Investasi</p>
                  <p className="text-2xl font-bold text-accent">
                    {formatCurrency(stats?.totalInvestments || 0)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Financial Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-text-primary mb-6">
                  Skor Kesehatan Keuangan
                </h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg
                      className="w-32 h-32 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#0052CC"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${
                          (stats?.financialHealthScore || 0) * 2.51
                        } 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getHealthScoreColor(
                            stats?.financialHealthScore || 0
                          )}`}
                        >
                          {stats?.financialHealthScore || 0}
                        </div>
                        <div className="text-sm text-text-metadata">
                          dari 100
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-description">
                      Pertumbuhan Bulanan
                    </span>
                    <span className="font-medium text-success">
                      +{stats?.monthlyGrowth || 0}%
                    </span>
                  </div>
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = "/chat")}
                    >
                      Konsultasi AI untuk Saran
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Aksi Cepat
                </h3>
                <div className="space-y-3">
                  <Link href="/chat">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      icon={<MessageIcon />}
                    >
                      Chat dengan AI Finansial
                    </Button>
                  </Link>
                  <Link href="/consultants">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      icon={<CalendarIcon />}
                    >
                      Book Konsultan
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      icon={<ChartIcon />}
                    >
                      Analisis Portofolio
                    </Button>
                  </Link>
                  <Link href="/education">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      icon={<ChartIcon />}
                    >
                      Edukasi Keuangan
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                Aktivitas Terbaru
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg ${getActivityColor(
                        activity.type
                      )} bg-opacity-10`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">
                        {activity.description}
                      </p>
                      <p className="text-sm text-text-metadata">
                        {new Date(activity.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    {activity.amount && (
                      <div
                        className={`font-semibold ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {activity.type === "EXPENSE" ? "-" : "+"}
                        {formatCurrency(activity.amount)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
