/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
  // Enhanced mock data with Indonesian context
  const summaryCards = [
    {
      title: "Total Saldo",
      value: "Rp 45.250.000",
      change: "+12.5%",
      trend: "up",
      icon: Wallet,
      color: "blue",
      description: "Total aset keuangan Anda",
    },
    {
      title: "Pendapatan Bulanan",
      value: "Rp 8.500.000",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
      description: "Pendapatan bulan ini",
    },
    {
      title: "Pengeluaran Bulanan",
      value: "Rp 6.200.000",
      change: "-8.1%",
      trend: "down",
      icon: CreditCard,
      color: "red",
      description: "Pengeluaran bulan ini",
    },
    {
      title: "Target Menabung",
      value: "78%",
      change: "+15%",
      trend: "up",
      icon: Target,
      color: "purple",
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

  // Chart data
  const incomeExpenseData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Pendapatan",
        data: [8200000, 8500000, 8100000, 8800000, 8500000, 8700000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Pengeluaran",
        data: [6500000, 6200000, 6800000, 6100000, 6200000, 5900000],
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
