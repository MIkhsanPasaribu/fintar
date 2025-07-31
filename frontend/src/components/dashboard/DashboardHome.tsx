/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CreditCard,
  Wallet,
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import AIInsightsWidget from "./AIInsightsWidget";
import { useUser } from "@/hooks/useUser";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardHome = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  // Check profile completion
  const checkProfileCompletion = () => {
    if (!user?.profile) return { completed: false, missing: ["profile"] };

    const requiredFields = [
      "income",
      "monthlyExpenses",
      "currentSavings",
      "riskTolerance",
    ];
    const missing = requiredFields.filter(
      (field) => !user.profile?.[field as keyof typeof user.profile]
    );

    return {
      completed: missing.length === 0,
      missing,
      completionPercentage: Math.round(
        ((requiredFields.length - missing.length) / requiredFields.length) * 100
      ),
    };
  };

  const profileStatus = checkProfileCompletion();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Real data from user profile
  const formatCurrency = (amount?: number) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateNetIncome = () => {
    const income = user?.profile?.income || 0;
    const expenses = user?.profile?.monthlyExpenses || 0;
    return income - expenses;
  };

  // If no profile data, show empty state
  if (!user?.profile?.income && !isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Selesaikan Profil Anda
          </h3>
          <p className="text-gray-600 mb-6">
            Isi informasi keuangan di profil untuk melihat dashboard lengkap
          </p>
          <button
            onClick={() => (window.location.href = "/profile")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lengkapi Profil
          </button>
        </div>
      </div>
    );
  }

  const calculateSavingsProgress = () => {
    const netIncome = calculateNetIncome();
    const targetSavings = netIncome * 0.2; // 20% target
    const actualSavings = netIncome > 0 ? netIncome : 0;
    return targetSavings > 0
      ? Math.min((actualSavings / targetSavings) * 100, 100)
      : 0;
  };

  const summaryCards = [
    {
      title: "Total Saldo",
      value: formatCurrency(user?.profile?.currentSavings),
      change: "+12.5%",
      trend: "up" as const,
      icon: Wallet,
      color: "blue" as const,
      description: "Total aset keuangan Anda",
    },
    {
      title: "Pendapatan Bulanan",
      value: formatCurrency(user?.profile?.income),
      change: "+5.2%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "green" as const,
      description: "Pendapatan bulan ini",
    },
    {
      title: "Pengeluaran Bulanan",
      value: formatCurrency(user?.profile?.monthlyExpenses),
      change: "-8.1%",
      trend: "down" as const,
      icon: CreditCard,
      color: "red" as const,
      description: "Pengeluaran bulan ini",
    },
    {
      title: "Target Menabung",
      value: `${Math.round(calculateSavingsProgress())}%`,
      change: "+15%",
      trend: "up" as const,
      icon: Target,
      color: "purple" as const,
      description: "Progress target tabungan",
    },
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: 1,
      type: "expense",
      category: "Food & Dining",
      description: "Warung Padang Sederhana",
      amount: -45000,
      date: "2025-01-26",
      time: "12:30",
    },
    {
      id: 2,
      type: "income",
      category: "Salary",
      description: "Gaji Bulanan",
      amount: 8500000,
      date: "2025-01-25",
      time: "09:00",
    },
    {
      id: 3,
      type: "expense",
      category: "Transportation",
      description: "Grab to Office",
      amount: -25000,
      date: "2025-01-25",
      time: "08:15",
    },
    {
      id: 4,
      type: "expense",
      category: "Shopping",
      description: "Tokopedia - Baju Kerja",
      amount: -275000,
      date: "2025-01-24",
      time: "20:45",
    },
  ];

  // Chart data based on user profile
  const currentIncome = user?.profile?.income || 0;
  const currentExpenses = user?.profile?.monthlyExpenses || 0;

  const incomeExpenseData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Pendapatan",
        data: [
          currentIncome * 0.95,
          currentIncome,
          currentIncome * 0.98,
          currentIncome * 1.05,
          currentIncome,
          currentIncome * 1.02,
        ],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Pengeluaran",
        data: [
          currentExpenses * 1.05,
          currentExpenses,
          currentExpenses * 1.1,
          currentExpenses * 0.95,
          currentExpenses,
          currentExpenses * 0.92,
        ],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const expenseBreakdownData = {
    labels: [
      "Food & Dining",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Bills",
    ],
    datasets: [
      {
        data: [2100000, 800000, 1200000, 600000, 1500000],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "Rp " + (value / 1000000).toFixed(1) + "M";
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Profile Completion Banner */}
      {!profileStatus.completed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  Lengkapi Profile Anda ({profileStatus.completionPercentage}%)
                </h3>
                <p className="text-sm text-blue-700">
                  Isi data finansial untuk mendapatkan insight yang lebih akurat
                </p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lengkapi Sekarang
            </button>
          </div>
          <div className="mt-3 bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileStatus.completionPercentage}%` }}
            />
          </div>
        </motion.div>
      )}
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Selamat Datang Kembali! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Fintar AI siap membantu optimalisasi finansial Anda
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center space-x-2 font-medium shadow-lg">
              <Sparkles className="h-5 w-5" />
              <span>AI Insights</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${
                  card.color === "blue"
                    ? "from-blue-500 to-cyan-500"
                    : card.color === "green"
                    ? "from-emerald-500 to-teal-500"
                    : card.color === "red"
                    ? "from-red-500 to-pink-500"
                    : "from-purple-500 to-indigo-500"
                }`}
              >
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm font-semibold px-2 py-1 rounded-full ${
                  card.trend === "up"
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                }`}
              >
                {card.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{card.change}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AIInsightsWidget />
      </motion.div>

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Pendapatan vs Pengeluaran
              </h3>
              <p className="text-gray-600 text-sm">Trend 6 bulan terakhir</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Pendapatan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Pengeluaran</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <Line data={incomeExpenseData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Transaksi Terbaru
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {transaction.category} • {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : ""}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(Math.abs(transaction.amount))}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(transaction.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Expense Breakdown Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Breakdown Pengeluaran
            </h3>
            <p className="text-gray-600 text-sm">
              Distribusi pengeluaran bulan ini
            </p>
          </div>
        </div>

        <div className="h-80">
          <Doughnut data={expenseBreakdownData} options={doughnutOptions} />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
