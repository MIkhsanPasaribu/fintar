"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import {
  PortfolioBreakdown,
  RecentActivity,
} from "@/components/dashboard/PortfolioComponents";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

// Types
interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  totalSavings: number;
  investmentGrowth: number;
}

interface Investment {
  name: string;
  value: number;
  change: number;
  color: string;
}

interface Transaction {
  id: number;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
}

interface EducationModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  type: "article" | "video" | "interactive";
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBalance: 0,
    monthlyIncome: 0,
    totalSavings: 0,
    investmentGrowth: 0,
  });

  // Sample data - replace with actual API calls
  const sampleInvestments: Investment[] = [
    {
      name: "Saham Blue Chip",
      value: 15000000,
      change: 5.2,
      color: "text-primary",
    },
    {
      name: "Reksadana Campuran",
      value: 8500000,
      change: 3.1,
      color: "text-secondary",
    },
    { name: "Obligasi", value: 5000000, change: 2.8, color: "text-accent" },
    { name: "Deposito", value: 12000000, change: 4.5, color: "text-success" },
  ];

  const sampleTransactions: Transaction[] = [
    {
      id: 1,
      type: "buy",
      asset: "BBRI",
      amount: 2500000,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      type: "sell",
      asset: "BBCA",
      amount: 1800000,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      type: "buy",
      asset: "RDPT Equilibrium",
      amount: 1000000,
      date: "2024-01-13",
      status: "pending",
    },
  ];

  const sampleEducationModules: EducationModule[] = [
    {
      id: "1",
      title: "Dasar-dasar Investasi",
      description: "Pelajari konsep fundamental investasi untuk pemula",
      duration: "30 menit",
      difficulty: "beginner",
      progress: 75,
      type: "article",
    },
    {
      id: "2",
      title: "Strategi Diversifikasi Portfolio",
      description: "Cara menyebarkan risiko investasi dengan diversifikasi",
      duration: "45 menit",
      difficulty: "intermediate",
      progress: 30,
      type: "video",
    },
    {
      id: "3",
      title: "Analisis Fundamental Saham",
      description:
        "Teknik menilai nilai intrinsik saham untuk investasi jangka panjang",
      duration: "60 menit",
      difficulty: "advanced",
      progress: 0,
      type: "interactive",
    },
  ];

  const dashboardFeatures: Feature[] = [
    {
      icon: (
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
      ),
      title: "AI Financial Planner",
      description: "Dapatkan rencana keuangan personal berdasarkan AI",
      href: "/chat",
    },
    {
      icon: (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      title: "Investment Tracker",
      description: "Pantau performa investasi Anda secara real-time",
      href: "/investments",
    },
    {
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Expert Consultation",
      description: "Konsultasi dengan financial advisor bersertifikat",
      href: "/consultants",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API calls
        // const data = await financialApi.getDashboardData();
        // setDashboardData(data);

        // Use sample data for now
        setDashboardData({
          totalBalance: 45000000,
          monthlyIncome: 8500000,
          totalSavings: 12000000,
          investmentGrowth: 8.5,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use sample data on error
        setDashboardData({
          totalBalance: 45000000,
          monthlyIncome: 8500000,
          totalSavings: 12000000,
          investmentGrowth: 8.5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metrics = [
    {
      title: "Total Saldo",
      value: formatCurrency(dashboardData.totalBalance),
      change: "+12.5%",
      icon: (
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
      ),
      trend: "up" as const,
    },
    {
      title: "Pendapatan Bulanan",
      value: formatCurrency(dashboardData.monthlyIncome),
      change: "+8.2%",
      icon: (
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
      ),
      trend: "up" as const,
    },
    {
      title: "Total Tabungan",
      value: formatCurrency(dashboardData.totalSavings),
      change: "+15.1%",
      icon: (
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
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      trend: "up" as const,
    },
    {
      title: "Pertumbuhan Investasi",
      value: `${dashboardData.investmentGrowth}%`,
      change: "+2.3%",
      icon: (
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
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      trend: "up" as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Dashboard Keuangan
          </h1>
          <p className="text-text-description">
            Kelola dan pantau kondisi finansial Anda
          </p>
        </motion.div>

        {/* Metrics Cards */}
        <MetricsGrid metrics={metrics} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Breakdown */}
          <PortfolioBreakdown investments={sampleInvestments} />

          {/* Recent Activity */}
          <RecentActivity transactions={sampleTransactions} />
        </div>

        {/* Dashboard Tabs */}
        <DashboardTabs
          educationModules={sampleEducationModules}
          features={dashboardFeatures}
        />
      </div>
    </div>
  );
}
