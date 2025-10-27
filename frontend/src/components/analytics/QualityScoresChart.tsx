"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QualityScoreStats } from "./AnalyticsTypes";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  metrics: QualityScoreStats;
}

export function QualityScoresChart({ metrics }: Props) {
  const data = [
    {
      criterion: "Accuracy",
      score: metrics.averageScores.accuracy,
      fullMark: 100,
    },
    {
      criterion: "Relevance",
      score: metrics.averageScores.relevance,
      fullMark: 100,
    },
    {
      criterion: "Actionability",
      score: metrics.averageScores.actionability,
      fullMark: 100,
    },
    {
      criterion: "Clarity",
      score: metrics.averageScores.clarity,
      fullMark: 100,
    },
    {
      criterion: "Completeness",
      score: metrics.averageScores.completeness,
      fullMark: 100,
    },
    {
      criterion: "Personalization",
      score: metrics.averageScores.personalization,
      fullMark: 100,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quality Scores (6 Criteria)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="criterion" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Average Score"
              dataKey="score"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Overall Score:{" "}
            <span className="font-bold text-purple-600">
              {metrics.averageOverallScore.toFixed(1)}/100
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Based on {metrics.count} evaluations
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
