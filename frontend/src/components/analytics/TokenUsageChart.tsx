"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenUsageStats } from "./AnalyticsTypes";

interface Props {
  metrics: TokenUsageStats;
}

export function TokenUsageChart({ metrics }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Token Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Tokens</p>
              <p className="text-2xl font-bold">
                {metrics.totalTokens.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg per Request</p>
              <p className="text-2xl font-bold">
                {metrics.averageTokensPerRequest.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600">Estimated Cost</p>
            <p className="text-3xl font-bold text-yellow-700">
              ${metrics.estimatedCost.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.totalRequests} requests
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
