"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DollarSign, TrendingUp, Target } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-text-description" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-text-primary">{value}</div>
          {trend && (
            <div
              className={`flex items-center text-sm ${
                trend.isPositive ? "text-success" : "text-error"
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend.isPositive ? "+" : ""}
              {trend.value}% bulan ini
            </div>
          )}
          {description && (
            <p className="text-sm text-text-description mt-2">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface OverviewMetricsProps {
  metrics: {
    totalValue: number;
    monthlyGrowth: number;
    goalProgress: number;
    consultations: number;
  };
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  metrics,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total Portfolio"
        value={formatCurrency(metrics.totalValue)}
        icon={DollarSign}
        trend={{
          value: metrics.monthlyGrowth,
          isPositive: metrics.monthlyGrowth > 0,
        }}
        delay={0}
      />

      <MetricCard
        title="Progress Tujuan"
        value={`${metrics.goalProgress}%`}
        description={`Target: ${formatCurrency(200000000)}`}
        icon={Target}
        delay={0.1}
      />

      <MetricCard
        title="Konsultasi"
        value={metrics.consultations.toString()}
        description="Sesi bulan ini"
        icon={Target}
        delay={0.2}
      />
    </div>
  );
};
