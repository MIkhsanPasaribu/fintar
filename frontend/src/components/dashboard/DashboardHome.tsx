/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Target,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  Sparkles,
  Bell,
} from "lucide-react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
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
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const DashboardHome = () => {
  const [timeframe, setTimeframe] = useState("month");

  // Mock data
  const summaryCards = [
    {
      title: "Total Balance",
      value: "Rp 45,250,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Monthly Income",
      value: "Rp 8,500,000",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Monthly Expenses",
      value: "Rp 6,200,000",
      change: "-8.1%",
      trend: "down",
      icon: ArrowDownRight,
      color: "red",
    },
    {
      title: "Savings Goal",
      value: "78%",
      change: "+15%",
      trend: "up",
      icon: Target,
      color: "purple",
    },
  ];

  // Chart data
  const incomeExpenseData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [8200000, 8500000, 8100000, 8800000, 8500000, 8700000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: [6500000, 6200000, 6800000, 6100000, 6200000, 5900000],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const expenseBreakdownData = {
    labels: [
      "Food",
      "Transportation",
      "Entertainment",
      "Bills",
      "Shopping",
      "Others",
    ],
    datasets: [
      {
        data: [1800000, 1200000, 800000, 1500000, 600000, 300000],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#6B7280",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>AI Insights</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                <card.icon className={`h-6 w-6 text-${card.color}-600`} />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  card.trend === "up" ? "text-green-600" : "text-red-600"
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

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Income vs Expenses
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Income</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <Line data={incomeExpenseData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Expense Breakdown
          </h3>

          <div className="h-80">
            <Doughnut data={expenseBreakdownData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <PiggyBank className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                Add Expense
              </span>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
              <TrendingUp className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">
                Set Goal
              </span>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
              <Users className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">
                Book Consultant
              </span>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
              <Sparkles className="h-8 w-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">
                AI Analysis
              </span>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                type: "expense",
                description: "Grocery Shopping",
                amount: "-Rp 450,000",
                time: "2 hours ago",
              },
              {
                type: "income",
                description: "Salary Deposit",
                amount: "+Rp 8,500,000",
                time: "1 day ago",
              },
              {
                type: "goal",
                description: "Emergency Fund Goal Updated",
                amount: "+15%",
                time: "2 days ago",
              },
              {
                type: "consultation",
                description: "Meeting with Ahmad Wijaya",
                amount: "Completed",
                time: "3 days ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "expense"
                        ? "bg-red-100"
                        : activity.type === "income"
                        ? "bg-green-100"
                        : activity.type === "goal"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {activity.type === "expense" && (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    {activity.type === "income" && (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    )}
                    {activity.type === "goal" && (
                      <Target className="h-4 w-4 text-blue-600" />
                    )}
                    {activity.type === "consultation" && (
                      <Users className="h-4 w-4 text-purple-600" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>

                <span
                  className={`font-semibold ${
                    activity.amount.startsWith("-")
                      ? "text-red-600"
                      : activity.amount.startsWith("+")
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {activity.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
