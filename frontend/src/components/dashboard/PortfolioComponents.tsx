"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

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

interface PortfolioBreakdownProps {
  investments: Investment[];
}

interface RecentActivityProps {
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({
  investments,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Komposisi Portfolio</CardTitle>
        <CardDescription>Distribusi investasi Anda saat ini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {investments.map((investment, index) => (
          <motion.div
            key={investment.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full bg-current ${investment.color}`}
              />
              <div>
                <p className="font-medium text-text-primary">
                  {investment.name}
                </p>
                <p className="text-sm text-text-description">
                  {formatCurrency(investment.value)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center ${
                  investment.change >= 0 ? "text-success" : "text-error"
                }`}
              >
                {investment.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {Math.abs(investment.change)}%
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  transactions,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Transaksi dan update terbaru</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === "buy" ? "bg-success/10" : "bg-error/10"
                }`}
              >
                {transaction.type === "buy" ? (
                  <TrendingUp className={`w-4 h-4 text-success`} />
                ) : (
                  <TrendingDown className={`w-4 h-4 text-error`} />
                )}
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {transaction.type === "buy" ? "Beli" : "Jual"}{" "}
                  {transaction.asset}
                </p>
                <p className="text-sm text-text-description">
                  {transaction.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-text-primary">
                {formatCurrency(transaction.amount)}
              </p>
              <Badge
                variant={
                  transaction.status === "completed" ? "success" : "secondary"
                }
              >
                {transaction.status === "completed" ? "Selesai" : "Pending"}
              </Badge>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};
