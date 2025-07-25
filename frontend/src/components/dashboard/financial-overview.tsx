"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Progress } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

// Icons
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

const TrendingDownIcon = () => (
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
      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
    />
  </svg>
);

const DollarSignIcon = () => (
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
);

const CreditCardIcon = () => (
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

interface FinancialOverviewProps {
  data: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    investments: number;
    savingsRate: number;
    expenseRatio: number;
  };
}

export default function FinancialOverview({ data }: FinancialOverviewProps) {
  const netWorth = data.totalBalance + data.investments;
  const cashFlow = data.monthlyIncome - data.monthlyExpenses;
  const isPositiveCashFlow = cashFlow >= 0;

  const overviewCards = [
    {
      title: "Total Saldo",
      value: data.totalBalance,
      change: "+2.5%",
      positive: true,
      icon: DollarSignIcon,
      bgColor: "bg-[#E3F2FD]",
      iconColor: "text-[#0052CC]",
    },
    {
      title: "Pendapatan Bulanan",
      value: data.monthlyIncome,
      change: "+5.2%",
      positive: true,
      icon: TrendingUpIcon,
      bgColor: "bg-[#E8F5E9]",
      iconColor: "text-[#00C853]",
    },
    {
      title: "Pengeluaran Bulanan",
      value: data.monthlyExpenses,
      change: "-1.2%",
      positive: true,
      icon: CreditCardIcon,
      bgColor: "bg-[#FFF3E0]",
      iconColor: "text-[#FF9800]",
    },
    {
      title: "Cash Flow",
      value: cashFlow,
      change: isPositiveCashFlow ? "+8.7%" : "-3.1%",
      positive: isPositiveCashFlow,
      icon: isPositiveCashFlow ? TrendingUpIcon : TrendingDownIcon,
      bgColor: isPositiveCashFlow ? "bg-[#E8F5E9]" : "bg-[#FFEBEE]",
      iconColor: isPositiveCashFlow ? "text-[#00C853]" : "text-[#D32F2F]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border border-[#E9ECEF] bg-white">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${card.bgColor} ${card.iconColor}`}
                    >
                      <IconComponent />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        card.positive ? "text-[#00C853]" : "text-[#D32F2F]"
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-[#78909C]">{card.title}</p>
                    <p className="text-2xl font-bold text-[#0A1628]">
                      {formatCurrency(card.value)}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Financial Health Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border border-[#E9ECEF] bg-white">
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold text-[#0A1628] mb-6">
              Indikator Kesehatan Keuangan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Savings Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#37474F]">
                    Tingkat Tabungan
                  </span>
                  <span className="text-sm text-[#78909C]">
                    {data.savingsRate}% (Target: 20%)
                  </span>
                </div>
                <Progress
                  value={data.savingsRate}
                  max={30}
                  variant={
                    data.savingsRate >= 20
                      ? "success"
                      : data.savingsRate >= 10
                      ? "warning"
                      : "danger"
                  }
                />
                <p className="text-xs text-[#78909C]">
                  {data.savingsRate >= 20
                    ? "Excellent! Anda menabung dengan baik"
                    : data.savingsRate >= 10
                    ? "Good, tapi bisa ditingkatkan lagi"
                    : "Perlu meningkatkan kebiasaan menabung"}
                </p>
              </div>

              {/* Expense Ratio */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#37474F]">
                    Rasio Pengeluaran
                  </span>
                  <span className="text-sm text-[#78909C]">
                    {data.expenseRatio}% dari pendapatan
                  </span>
                </div>
                <Progress
                  value={data.expenseRatio}
                  max={100}
                  variant={
                    data.expenseRatio <= 70
                      ? "success"
                      : data.expenseRatio <= 85
                      ? "warning"
                      : "danger"
                  }
                />
                <p className="text-xs text-[#78909C]">
                  {data.expenseRatio <= 70
                    ? "Excellent! Pengeluaran terkontrol dengan baik"
                    : data.expenseRatio <= 85
                    ? "Masih dalam batas wajar"
                    : "Perlu mengurangi pengeluaran"}
                </p>
              </div>
            </div>

            {/* Net Worth Summary */}
            <div className="mt-6 pt-6 border-t border-[#E9ECEF]">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-[#78909C]">
                    Total Kekayaan Bersih
                  </h4>
                  <p className="text-xl font-bold text-[#0A1628]">
                    {formatCurrency(netWorth)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#78909C]">Investasi</p>
                  <p className="text-lg font-semibold text-[#00C853]">
                    {formatCurrency(data.investments)}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
