"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorDistribution } from "./AnalyticsTypes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  errors: ErrorDistribution[];
}

export function ErrorDistributionChart({ errors }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Error Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={errors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
