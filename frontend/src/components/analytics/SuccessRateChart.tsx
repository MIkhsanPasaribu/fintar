"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuccessRateStats } from "./AnalyticsTypes";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Props {
  metrics: SuccessRateStats;
}

const COLORS = {
  success: "#10b981",
  failed: "#ef4444",
};

export function SuccessRateChart({ metrics }: Props) {
  const data = [
    { name: "Successful", value: metrics.successfulRequests },
    { name: "Failed", value: metrics.failedRequests },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Success vs Failed Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) =>
                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === "Successful" ? COLORS.success : COLORS.failed
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Total Requests:{" "}
            <span className="font-bold">{metrics.totalRequests}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
