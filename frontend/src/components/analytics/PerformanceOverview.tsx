"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceMetrics } from "./AnalyticsTypes";
import {
  Activity,
  Clock,
  Coins,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

interface Props {
  metrics: PerformanceMetrics;
}

export function PerformanceOverview({ metrics }: Props) {
  const { responseTime, tokenUsage, successRate, qualityScores } = metrics;

  const cards = [
    {
      title: "Avg Response Time",
      value: `${responseTime.average}ms`,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      subtitle: `p95: ${responseTime.p95}ms`,
    },
    {
      title: "Success Rate",
      value: `${successRate.successRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
      subtitle: `${successRate.successfulRequests}/${successRate.totalRequests} requests`,
    },
    {
      title: "Token Usage",
      value: tokenUsage.totalTokens.toLocaleString(),
      icon: Coins,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      subtitle: `~$${tokenUsage.estimatedCost.toFixed(2)} cost`,
    },
    {
      title: "Quality Score",
      value: qualityScores.averageOverallScore.toFixed(1),
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      subtitle: `${qualityScores.count} evaluations`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
