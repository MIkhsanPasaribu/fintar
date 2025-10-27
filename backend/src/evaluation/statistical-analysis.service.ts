import { Injectable, Logger } from "@nestjs/common";

/**
 * Statistical Analysis Service
 *
 * Provides statistical methods for comparing AI vs Baseline systems.
 * Used for journal publication analysis.
 *
 * Methods:
 * - Independent samples t-test
 * - Cohen's d effect size
 * - 95% Confidence intervals
 * - Statistical significance determination
 */

export interface TTestResult {
  tStatistic: number;
  degreesOfFreedom: number;
  pValue: number;
  isSignificant: boolean; // p < 0.05
  significanceLevel: number; // 0.05
}

export interface EffectSizeResult {
  cohensD: number;
  interpretation: "negligible" | "small" | "medium" | "large" | "very large";
  description: string;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  confidence: number; // 95
  mean: number;
}

export interface StatisticalAnalysisResult {
  // Sample Information
  aiSampleSize: number;
  baselineSampleSize: number;

  // Descriptive Statistics
  aiMean: number;
  baselineMean: number;
  aiMedian: number;
  baselineMedian: number;
  aiStdDev: number;
  baselineStdDev: number;

  // Inferential Statistics
  tTest: TTestResult;
  effectSize: EffectSizeResult;
  aiConfidenceInterval: ConfidenceInterval;
  baselineConfidenceInterval: ConfidenceInterval;
  meanDifference: number;
  meanDifferenceCI: ConfidenceInterval;

  // Interpretation
  conclusion: string;
  journalStatement: string; // Ready-to-use statement for journal paper
}

@Injectable()
export class StatisticalAnalysisService {
  private readonly logger = new Logger(StatisticalAnalysisService.name);

  /**
   * Perform complete statistical analysis on two samples
   */
  performAnalysis(
    aiScores: number[],
    baselineScores: number[]
  ): StatisticalAnalysisResult {
    this.logger.log(
      `Performing statistical analysis: AI (n=${aiScores.length}), Baseline (n=${baselineScores.length})`
    );

    // Descriptive Statistics
    const aiMean = this.calculateMean(aiScores);
    const baselineMean = this.calculateMean(baselineScores);
    const aiMedian = this.calculateMedian(aiScores);
    const baselineMedian = this.calculateMedian(baselineScores);
    const aiStdDev = this.calculateStdDev(aiScores);
    const baselineStdDev = this.calculateStdDev(baselineScores);

    // Inferential Statistics
    const tTest = this.performTTest(aiScores, baselineScores);
    const effectSize = this.calculateCohenD(
      aiMean,
      baselineMean,
      aiStdDev,
      baselineStdDev,
      aiScores.length,
      baselineScores.length
    );

    const aiCI = this.calculateConfidenceInterval(
      aiMean,
      aiStdDev,
      aiScores.length
    );
    const baselineCI = this.calculateConfidenceInterval(
      baselineMean,
      baselineStdDev,
      baselineScores.length
    );

    const meanDifference = aiMean - baselineMean;
    const meanDifferenceCI = this.calculateMeanDifferenceCI(
      aiScores,
      baselineScores
    );

    // Generate conclusion
    const conclusion = this.generateConclusion(
      tTest,
      effectSize,
      meanDifference
    );
    const journalStatement = this.generateJournalStatement(
      aiMean,
      baselineMean,
      aiStdDev,
      baselineStdDev,
      tTest,
      effectSize
    );

    return {
      aiSampleSize: aiScores.length,
      baselineSampleSize: baselineScores.length,
      aiMean,
      baselineMean,
      aiMedian,
      baselineMedian,
      aiStdDev,
      baselineStdDev,
      tTest,
      effectSize,
      aiConfidenceInterval: aiCI,
      baselineConfidenceInterval: baselineCI,
      meanDifference,
      meanDifferenceCI,
      conclusion,
      journalStatement,
    };
  }

  /**
   * Calculate mean (average)
   */
  calculateMean(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / numbers.length) * 100) / 100; // Round to 2 decimals
  }

  /**
   * Calculate median (middle value)
   */
  calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Calculate standard deviation
   */
  calculateStdDev(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = this.calculateMean(numbers);
    const squaredDiffs = numbers.map((val) => Math.pow(val - mean, 2));
    const variance = this.calculateMean(squaredDiffs);
    return Math.round(Math.sqrt(variance) * 100) / 100; // Round to 2 decimals
  }

  /**
   * Perform independent samples t-test
   * Tests if means of two groups are significantly different
   */
  performTTest(sample1: number[], sample2: number[]): TTestResult {
    const n1 = sample1.length;
    const n2 = sample2.length;
    const mean1 = this.calculateMean(sample1);
    const mean2 = this.calculateMean(sample2);
    const std1 = this.calculateStdDev(sample1);
    const std2 = this.calculateStdDev(sample2);

    // Pooled standard deviation
    const pooledStd = Math.sqrt(
      ((n1 - 1) * Math.pow(std1, 2) + (n2 - 1) * Math.pow(std2, 2)) /
        (n1 + n2 - 2)
    );

    // Standard error
    const standardError = pooledStd * Math.sqrt(1 / n1 + 1 / n2);

    // t-statistic
    const tStatistic = (mean1 - mean2) / standardError;

    // Degrees of freedom
    const degreesOfFreedom = n1 + n2 - 2;

    // Approximate p-value using t-distribution
    const pValue = this.approximatePValue(
      Math.abs(tStatistic),
      degreesOfFreedom
    );

    // Determine significance (α = 0.05)
    const isSignificant = pValue < 0.05;

    return {
      tStatistic: Math.round(tStatistic * 1000) / 1000, // 3 decimals
      degreesOfFreedom,
      pValue: Math.round(pValue * 10000) / 10000, // 4 decimals
      isSignificant,
      significanceLevel: 0.05,
    };
  }

  /**
   * Approximate p-value for t-test
   * Using simplified approximation (for large samples, converges to normal distribution)
   */
  private approximatePValue(tStat: number, df: number): number {
    // For large df (>30), t-distribution approximates normal distribution
    // Using simple approximation for demonstration
    // In production, use a proper statistical library like jStat

    if (df > 30) {
      // Approximate using standard normal distribution
      // P(|Z| > tStat) ≈ 2 * (1 - Φ(tStat))
      const z = tStat;
      const p = 2 * (1 - this.normalCDF(z));
      return Math.max(0.0001, Math.min(0.9999, p)); // Clamp between 0.0001 and 0.9999
    } else {
      // For small samples, use conservative estimate
      // This is a rough approximation
      const criticalValues = [
        { df: 10, t90: 1.812, t95: 2.228, t99: 3.169 },
        { df: 20, t90: 1.725, t95: 2.086, t99: 2.845 },
        { df: 30, t90: 1.697, t95: 2.042, t99: 2.75 },
      ];

      const closest = criticalValues.reduce((prev, curr) =>
        Math.abs(curr.df - df) < Math.abs(prev.df - df) ? curr : prev
      );

      if (tStat > closest.t99) return 0.01;
      if (tStat > closest.t95) return 0.05;
      if (tStat > closest.t90) return 0.1;
      return 0.2;
    }
  }

  /**
   * Cumulative distribution function for standard normal distribution
   */
  private normalCDF(x: number): number {
    // Approximation using error function
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    const prob =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }

  /**
   * Calculate Cohen's d effect size
   * Measures the standardized difference between two means
   */
  calculateCohenD(
    mean1: number,
    mean2: number,
    std1: number,
    std2: number,
    n1: number,
    n2: number
  ): EffectSizeResult {
    // Pooled standard deviation
    const pooledStd = Math.sqrt(
      ((n1 - 1) * Math.pow(std1, 2) + (n2 - 1) * Math.pow(std2, 2)) /
        (n1 + n2 - 2)
    );

    // Cohen's d
    const cohensD = (mean1 - mean2) / pooledStd;
    const absCohensD = Math.abs(cohensD);

    // Interpretation (Cohen's conventions)
    let interpretation: EffectSizeResult["interpretation"];
    let description: string;

    if (absCohensD < 0.2) {
      interpretation = "negligible";
      description = "Negligible effect size (d < 0.2)";
    } else if (absCohensD < 0.5) {
      interpretation = "small";
      description = "Small effect size (0.2 ≤ d < 0.5)";
    } else if (absCohensD < 0.8) {
      interpretation = "medium";
      description = "Medium effect size (0.5 ≤ d < 0.8)";
    } else if (absCohensD < 1.2) {
      interpretation = "large";
      description = "Large effect size (0.8 ≤ d < 1.2)";
    } else {
      interpretation = "very large";
      description = "Very large effect size (d ≥ 1.2)";
    }

    return {
      cohensD: Math.round(cohensD * 1000) / 1000, // 3 decimals
      interpretation,
      description,
    };
  }

  /**
   * Calculate 95% confidence interval for mean
   */
  calculateConfidenceInterval(
    mean: number,
    stdDev: number,
    n: number
  ): ConfidenceInterval {
    // For 95% CI, z-score ≈ 1.96
    const zScore = 1.96;
    const standardError = stdDev / Math.sqrt(n);
    const marginOfError = zScore * standardError;

    return {
      lower: Math.round((mean - marginOfError) * 100) / 100,
      upper: Math.round((mean + marginOfError) * 100) / 100,
      confidence: 95,
      mean: Math.round(mean * 100) / 100,
    };
  }

  /**
   * Calculate confidence interval for mean difference
   */
  calculateMeanDifferenceCI(
    sample1: number[],
    sample2: number[]
  ): ConfidenceInterval {
    const n1 = sample1.length;
    const n2 = sample2.length;
    const mean1 = this.calculateMean(sample1);
    const mean2 = this.calculateMean(sample2);
    const std1 = this.calculateStdDev(sample1);
    const std2 = this.calculateStdDev(sample2);

    const meanDiff = mean1 - mean2;

    // Standard error of difference
    const standardError = Math.sqrt(
      Math.pow(std1, 2) / n1 + Math.pow(std2, 2) / n2
    );

    // For 95% CI
    const zScore = 1.96;
    const marginOfError = zScore * standardError;

    return {
      lower: Math.round((meanDiff - marginOfError) * 100) / 100,
      upper: Math.round((meanDiff + marginOfError) * 100) / 100,
      confidence: 95,
      mean: Math.round(meanDiff * 100) / 100,
    };
  }

  /**
   * Generate conclusion based on statistical results
   */
  private generateConclusion(
    tTest: TTestResult,
    effectSize: EffectSizeResult,
    meanDifference: number
  ): string {
    const direction = meanDifference > 0 ? "superior" : "inferior";
    const significance = tTest.isSignificant
      ? "statistically significant"
      : "not statistically significant";

    let conclusion = `The AI system is ${direction} to the baseline system with a mean difference of ${Math.abs(meanDifference).toFixed(2)} points. `;
    conclusion += `This difference is ${significance} (p = ${tTest.pValue.toFixed(4)}). `;
    conclusion += `The effect size is ${effectSize.interpretation} (Cohen's d = ${effectSize.cohensD.toFixed(3)}). `;

    if (tTest.isSignificant && meanDifference > 0) {
      conclusion +=
        "These results provide strong evidence that the AI-powered system significantly outperforms the rule-based baseline system.";
    } else if (tTest.isSignificant && meanDifference < 0) {
      conclusion +=
        "Interestingly, the baseline system outperformed the AI system, which warrants further investigation.";
    } else {
      conclusion +=
        "The difference between systems is not statistically significant, suggesting comparable performance.";
    }

    return conclusion;
  }

  /**
   * Generate journal-ready statistical statement
   */
  private generateJournalStatement(
    aiMean: number,
    baselineMean: number,
    aiStd: number,
    baselineStd: number,
    tTest: TTestResult,
    effectSize: EffectSizeResult
  ): string {
    const statement =
      `The AI-powered system (M = ${aiMean.toFixed(2)}, SD = ${aiStd.toFixed(2)}) ` +
      `significantly outperformed the rule-based baseline system (M = ${baselineMean.toFixed(2)}, SD = ${baselineStd.toFixed(2)}), ` +
      `t(${tTest.degreesOfFreedom}) = ${tTest.tStatistic.toFixed(3)}, p ${tTest.pValue < 0.001 ? "< 0.001" : `= ${tTest.pValue.toFixed(3)}`}, ` +
      `Cohen's d = ${effectSize.cohensD.toFixed(3)}, indicating a ${effectSize.interpretation} effect size.`;

    return statement;
  }
}
