/**
 * StatisticalSignificancePanel Component
 *
 * Displays comprehensive statistical analysis results:
 * - Independent samples t-test
 * - Cohen's d effect size
 * - 95% Confidence intervals
 * - Journal-ready APA statement (with copy-to-clipboard)
 *
 * @author Fintar Team
 */

"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/tombol";
import { Copy, Check, TrendingUp, Award, BarChart2 } from "lucide-react";
import type { StatisticalAnalysisResult } from "@/hooks/useComparison";

interface StatisticalSignificancePanelProps {
  analysis: StatisticalAnalysisResult;
}

export function StatisticalSignificancePanel({
  analysis,
}: StatisticalSignificancePanelProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Copy journal statement to clipboard
   */
  const handleCopyJournalStatement = async () => {
    try {
      await navigator.clipboard.writeText(analysis.journalStatement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  /**
   * Get effect size color
   */
  const getEffectSizeColor = (interpretation: string) => {
    switch (interpretation.toLowerCase()) {
      case "very large":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "large":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "medium":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "small":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Statistical Significance Analysis
          </CardTitle>
          <CardDescription>
            Independent samples t-test and effect size calculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* T-Test Results */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-lg">T-Test Results</h3>
              </div>

              {/* t-statistic */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  t-statistic
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analysis.tTest.tStatistic.toFixed(3)}
                </p>
              </div>

              {/* Degrees of Freedom */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Degrees of Freedom (df)
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analysis.tTest.degreesOfFreedom}
                </p>
              </div>

              {/* p-value */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  p-value
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analysis.tTest.pValue < 0.001
                    ? "< 0.001"
                    : analysis.tTest.pValue.toFixed(4)}
                </p>
              </div>

              {/* Significance */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Significance (α = 0.05)
                </p>
                {analysis.tTest.isSignificant ? (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    ✓ Statistically Significant
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    ✗ Not Significant
                  </Badge>
                )}
              </div>
            </div>

            {/* Effect Size */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-lg">
                  Effect Size (Cohen's d)
                </h3>
              </div>

              {/* Cohen's d Value */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Cohen's d
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analysis.effectSize.cohensD.toFixed(3)}
                </p>
              </div>

              {/* Interpretation */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Interpretation
                </p>
                <Badge
                  className={`text-base px-4 py-2 ${getEffectSizeColor(
                    analysis.effectSize.interpretation
                  )}`}
                >
                  {analysis.effectSize.interpretation.toUpperCase()}
                </Badge>
              </div>

              {/* Description */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-900 dark:text-purple-200">
                  {analysis.effectSize.description}
                </p>
              </div>

              {/* Effect Size Reference */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                  Cohen's d Reference:
                </p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p>&lt; 0.2 = Negligible</p>
                  <p>0.2 - 0.5 = Small</p>
                  <p>0.5 - 0.8 = Medium</p>
                  <p>0.8 - 1.2 = Large</p>
                  <p>≥ 1.2 = Very Large</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Intervals */}
      <Card>
        <CardHeader>
          <CardTitle>95% Confidence Intervals</CardTitle>
          <CardDescription>
            Range of plausible values for true population parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* AI System CI */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-3">
                AI System Mean
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Mean:
                  </span>
                  <span className="font-bold text-green-700 dark:text-green-300">
                    {analysis.aiMean.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    95% CI:
                  </span>
                  <span className="font-bold text-green-700 dark:text-green-300">
                    [{analysis.aiConfidenceInterval.lower.toFixed(2)},{" "}
                    {analysis.aiConfidenceInterval.upper.toFixed(2)}]
                  </span>
                </div>
              </div>
            </div>

            {/* Baseline System CI */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">
                Baseline Mean
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Mean:
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {analysis.baselineMean.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    95% CI:
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    [{analysis.baselineConfidenceInterval.lower.toFixed(2)},{" "}
                    {analysis.baselineConfidenceInterval.upper.toFixed(2)}]
                  </span>
                </div>
              </div>
            </div>

            {/* Mean Difference CI */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Mean Difference
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Difference:
                  </span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">
                    {analysis.meanDifference.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    95% CI:
                  </span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">
                    [{analysis.meanDifferenceCI.lower.toFixed(2)},{" "}
                    {analysis.meanDifferenceCI.upper.toFixed(2)}]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <Card>
        <CardHeader>
          <CardTitle>Conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysis.conclusion}
          </p>
        </CardContent>
      </Card>

      {/* Journal Statement (Copy-to-Clipboard) */}
      <Card>
        <CardHeader>
          <CardTitle>Journal-Ready Statement (APA Style)</CardTitle>
          <CardDescription>
            Copy this statement directly to your research paper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-mono">
                {analysis.journalStatement}
              </p>
            </div>

            <Button
              onClick={handleCopyJournalStatement}
              className="w-full md:w-auto"
              variant={copied ? "default" : "outline"}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Journal Statement
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatisticalSignificancePanel;
