/**
 * Statistical Analysis Script
 *
 * Purpose: Automated statistical analysis of AI vs Baseline comparison results
 * Usage: npm run stats:analysis
 *
 * Features:
 * - Load comparison results from database
 * - Run comprehensive statistical tests (t-test, effect size, CI)
 * - Generate formatted console report
 * - Export to JSON and CSV formats for external analysis
 *
 * Output Files:
 * - statistical-analysis-results.json (programmatic access)
 * - statistical-analysis-results.csv (Excel/SPSS/R compatible)
 *
 * @author Fintar Research Team
 * @date 2025-01-13
 */

import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Statistical Analysis Result Interface
 * (Mirrored from statistical-analysis.service.ts)
 */
interface StatisticalAnalysisResult {
  aiSampleSize: number;
  baselineSampleSize: number;
  aiMean: number;
  aiMedian: number;
  aiStdDev: number;
  baselineMean: number;
  baselineMedian: number;
  baselineStdDev: number;
  meanDifference: number;
  tTest: {
    tStatistic: number;
    degreesOfFreedom: number;
    pValue: number;
    isSignificant: boolean;
    significanceLevel: number;
  };
  effectSize: {
    cohensD: number;
    interpretation: string;
    description: string;
  };
  aiConfidenceInterval: {
    lower: number;
    upper: number;
    confidence: number;
    mean: number;
  };
  baselineConfidenceInterval: {
    lower: number;
    upper: number;
    confidence: number;
    mean: number;
  };
  meanDifferenceCI: {
    lower: number;
    upper: number;
    confidence: number;
  };
  conclusion: string;
  journalStatement: string;
}

/**
 * Format number for display (2 decimal places)
 */
function formatNumber(num: number): string {
  return num.toFixed(2);
}

/**
 * Calculate mean of array
 */
function calculateMean(numbers: number[]): number {
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
}

/**
 * Calculate median of array
 */
function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return parseFloat(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
  }
  return sorted[mid];
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(numbers: number[]): number {
  const mean = calculateMean(numbers);
  const variance =
    numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    numbers.length;
  return parseFloat(Math.sqrt(variance).toFixed(2));
}

/**
 * Perform independent samples t-test
 */
function performTTest(sample1: number[], sample2: number[]) {
  const mean1 = calculateMean(sample1);
  const mean2 = calculateMean(sample2);
  const sd1 = calculateStdDev(sample1);
  const sd2 = calculateStdDev(sample2);
  const n1 = sample1.length;
  const n2 = sample2.length;

  // Pooled standard deviation
  const pooledSD = Math.sqrt(
    ((n1 - 1) * Math.pow(sd1, 2) + (n2 - 1) * Math.pow(sd2, 2)) / (n1 + n2 - 2)
  );

  // Standard error
  const standardError = pooledSD * Math.sqrt(1 / n1 + 1 / n2);

  // T-statistic
  const tStatistic = (mean1 - mean2) / standardError;

  // Degrees of freedom
  const df = n1 + n2 - 2;

  // Approximate p-value (simplified)
  const pValue = approximatePValue(Math.abs(tStatistic), df);

  return {
    tStatistic: parseFloat(tStatistic.toFixed(3)),
    degreesOfFreedom: df,
    pValue,
    isSignificant: pValue < 0.05,
    significanceLevel: 0.05,
  };
}

/**
 * Approximate p-value for t-test
 */
function approximatePValue(tStat: number, df: number): number {
  // For large samples (df > 30), use normal approximation
  if (df > 30) {
    const z = tStat;
    const p = 2 * (1 - normalCDF(z));
    return parseFloat(Math.max(0.0001, p).toFixed(4));
  }

  // For small samples, use conservative estimate
  if (tStat > 3.0) return 0.001;
  if (tStat > 2.0) return 0.05;
  return 0.1;
}

/**
 * Standard normal cumulative distribution function
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

/**
 * Calculate Cohen's d effect size
 */
function calculateCohenD(sample1: number[], sample2: number[]) {
  const mean1 = calculateMean(sample1);
  const mean2 = calculateMean(sample2);
  const sd1 = calculateStdDev(sample1);
  const sd2 = calculateStdDev(sample2);
  const n1 = sample1.length;
  const n2 = sample2.length;

  // Pooled standard deviation
  const pooledSD = Math.sqrt(
    ((n1 - 1) * Math.pow(sd1, 2) + (n2 - 1) * Math.pow(sd2, 2)) / (n1 + n2 - 2)
  );

  const cohensD = (mean1 - mean2) / pooledSD;

  let interpretation: string;
  let description: string;

  if (Math.abs(cohensD) < 0.2) {
    interpretation = "negligible";
    description = "The effect size is negligible";
  } else if (Math.abs(cohensD) < 0.5) {
    interpretation = "small";
    description = "The effect size is small";
  } else if (Math.abs(cohensD) < 0.8) {
    interpretation = "medium";
    description = "The effect size is medium";
  } else if (Math.abs(cohensD) < 1.2) {
    interpretation = "large";
    description = "The effect size is large";
  } else {
    interpretation = "very large";
    description = "The effect size is very large";
  }

  return {
    cohensD: parseFloat(cohensD.toFixed(3)),
    interpretation,
    description,
  };
}

/**
 * Calculate 95% confidence interval for mean
 */
function calculateConfidenceInterval(
  mean: number,
  stdDev: number,
  sampleSize: number
) {
  const zScore = 1.96; // 95% confidence
  const marginOfError = zScore * (stdDev / Math.sqrt(sampleSize));

  return {
    lower: parseFloat((mean - marginOfError).toFixed(2)),
    upper: parseFloat((mean + marginOfError).toFixed(2)),
    confidence: 95,
    mean,
  };
}

/**
 * Calculate confidence interval for mean difference
 */
function calculateMeanDifferenceCI(sample1: number[], sample2: number[]) {
  const mean1 = calculateMean(sample1);
  const mean2 = calculateMean(sample2);
  const sd1 = calculateStdDev(sample1);
  const sd2 = calculateStdDev(sample2);
  const n1 = sample1.length;
  const n2 = sample2.length;

  const pooledSD = Math.sqrt(
    ((n1 - 1) * Math.pow(sd1, 2) + (n2 - 1) * Math.pow(sd2, 2)) / (n1 + n2 - 2)
  );
  const standardError = pooledSD * Math.sqrt(1 / n1 + 1 / n2);
  const tCritical = 1.96; // Approximate for large samples
  const marginOfError = tCritical * standardError;
  const meanDiff = mean1 - mean2;

  return {
    lower: parseFloat((meanDiff - marginOfError).toFixed(2)),
    upper: parseFloat((meanDiff + marginOfError).toFixed(2)),
    confidence: 95,
  };
}

/**
 * Perform complete statistical analysis
 */
function performAnalysis(
  aiScores: number[],
  baselineScores: number[]
): StatisticalAnalysisResult {
  const aiMean = calculateMean(aiScores);
  const aiMedian = calculateMedian(aiScores);
  const aiStdDev = calculateStdDev(aiScores);

  const baselineMean = calculateMean(baselineScores);
  const baselineMedian = calculateMedian(baselineScores);
  const baselineStdDev = calculateStdDev(baselineScores);

  const meanDifference = parseFloat((aiMean - baselineMean).toFixed(2));

  const tTest = performTTest(aiScores, baselineScores);
  const effectSize = calculateCohenD(aiScores, baselineScores);
  const aiCI = calculateConfidenceInterval(aiMean, aiStdDev, aiScores.length);
  const baselineCI = calculateConfidenceInterval(
    baselineMean,
    baselineStdDev,
    baselineScores.length
  );
  const meanDifferenceCI = calculateMeanDifferenceCI(aiScores, baselineScores);

  const direction = meanDifference > 0 ? "superior to" : "inferior to";
  const significance = tTest.isSignificant
    ? "statistically significant"
    : "not statistically significant";

  const conclusion = `The AI system is ${direction} the baseline system with a mean difference of ${Math.abs(meanDifference)} points. This difference is ${significance} (p = ${tTest.pValue}) with a ${effectSize.interpretation} effect size (Cohen's d = ${effectSize.cohensD}).`;

  const journalStatement = `The AI-powered system (M = ${aiMean}, SD = ${aiStdDev}) ${meanDifference > 0 ? "significantly outperformed" : "underperformed compared to"} the rule-based baseline system (M = ${baselineMean}, SD = ${baselineStdDev}), t(${tTest.degreesOfFreedom}) = ${tTest.tStatistic}, p ${tTest.pValue < 0.001 ? "< 0.001" : "= " + tTest.pValue}, Cohen's d = ${effectSize.cohensD}, indicating a ${effectSize.interpretation} effect size.`;

  return {
    aiSampleSize: aiScores.length,
    baselineSampleSize: baselineScores.length,
    aiMean,
    aiMedian,
    aiStdDev,
    baselineMean,
    baselineMedian,
    baselineStdDev,
    meanDifference,
    tTest,
    effectSize,
    aiConfidenceInterval: aiCI,
    baselineConfidenceInterval: baselineCI,
    meanDifferenceCI,
    conclusion,
    journalStatement,
  };
}

/**
 * Print formatted console report
 */
function printReport(
  result: StatisticalAnalysisResult,
  metadata: { totalComparisons: number; dateRange: string }
) {
  console.log("\n" + "=".repeat(80));
  console.log("STATISTICAL ANALYSIS REPORT: AI vs Baseline Comparison");
  console.log("=".repeat(80));
  console.log(`\nGenerated: ${new Date().toISOString()}`);
  console.log(`Total Comparisons: ${metadata.totalComparisons}`);
  console.log(`Date Range: ${metadata.dateRange}`);

  console.log("\n" + "-".repeat(80));
  console.log("DESCRIPTIVE STATISTICS");
  console.log("-".repeat(80));

  console.log("\nAI System:");
  console.log(`  Sample Size:       ${result.aiSampleSize}`);
  console.log(`  Mean:              ${formatNumber(result.aiMean)}`);
  console.log(`  Median:            ${formatNumber(result.aiMedian)}`);
  console.log(`  Std Dev:           ${formatNumber(result.aiStdDev)}`);
  console.log(
    `  95% CI:            [${formatNumber(result.aiConfidenceInterval.lower)}, ${formatNumber(result.aiConfidenceInterval.upper)}]`
  );

  console.log("\nBaseline System:");
  console.log(`  Sample Size:       ${result.baselineSampleSize}`);
  console.log(`  Mean:              ${formatNumber(result.baselineMean)}`);
  console.log(`  Median:            ${formatNumber(result.baselineMedian)}`);
  console.log(`  Std Dev:           ${formatNumber(result.baselineStdDev)}`);
  console.log(
    `  95% CI:            [${formatNumber(result.baselineConfidenceInterval.lower)}, ${formatNumber(result.baselineConfidenceInterval.upper)}]`
  );

  console.log("\n" + "-".repeat(80));
  console.log("INFERENTIAL STATISTICS");
  console.log("-".repeat(80));

  console.log("\nMean Difference:");
  console.log(
    `  Difference:        ${formatNumber(result.meanDifference)} points`
  );
  console.log(
    `  95% CI:            [${formatNumber(result.meanDifferenceCI.lower)}, ${formatNumber(result.meanDifferenceCI.upper)}]`
  );

  console.log("\nIndependent Samples t-Test:");
  console.log(`  t-statistic:       ${result.tTest.tStatistic}`);
  console.log(`  df:                ${result.tTest.degreesOfFreedom}`);
  console.log(
    `  p-value:           ${result.tTest.pValue < 0.001 ? "< 0.001" : result.tTest.pValue}`
  );
  console.log(
    `  Significance:      ${result.tTest.isSignificant ? "✓ SIGNIFICANT" : "✗ NOT SIGNIFICANT"} (α = ${result.tTest.significanceLevel})`
  );

  console.log("\nEffect Size (Cohen's d):");
  console.log(`  Cohen's d:         ${result.effectSize.cohensD}`);
  console.log(
    `  Interpretation:    ${result.effectSize.interpretation.toUpperCase()}`
  );
  console.log(`  Description:       ${result.effectSize.description}`);

  console.log("\n" + "-".repeat(80));
  console.log("CONCLUSION");
  console.log("-".repeat(80));
  console.log(`\n${result.conclusion}\n`);

  console.log("-".repeat(80));
  console.log("JOURNAL-READY STATEMENT (APA Style)");
  console.log("-".repeat(80));
  console.log(`\n${result.journalStatement}\n`);

  console.log("=".repeat(80));
}

/**
 * Export results to JSON file
 */
function exportToJSON(
  result: StatisticalAnalysisResult,
  metadata: any,
  outputDir: string
) {
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalComparisons: metadata.totalComparisons,
      dateRange: metadata.dateRange,
      version: "1.0.0",
    },
    results: result,
  };

  const filePath = join(outputDir, "statistical-analysis-results.json");
  writeFileSync(filePath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`✓ JSON export saved to: ${filePath}`);
}

/**
 * Export results to CSV file
 */
function exportToCSV(
  result: StatisticalAnalysisResult,
  metadata: any,
  outputDir: string
) {
  const csvLines = [
    "Metric,AI System,Baseline System",
    `Sample Size,${result.aiSampleSize},${result.baselineSampleSize}`,
    `Mean,${result.aiMean},${result.baselineMean}`,
    `Median,${result.aiMedian},${result.baselineMedian}`,
    `Standard Deviation,${result.aiStdDev},${result.baselineStdDev}`,
    `95% CI Lower,${result.aiConfidenceInterval.lower},${result.baselineConfidenceInterval.lower}`,
    `95% CI Upper,${result.aiConfidenceInterval.upper},${result.baselineConfidenceInterval.upper}`,
    "",
    "Statistical Test,Value",
    `Mean Difference,${result.meanDifference}`,
    `Mean Difference 95% CI,${result.meanDifferenceCI.lower} to ${result.meanDifferenceCI.upper}`,
    `t-statistic,${result.tTest.tStatistic}`,
    `Degrees of Freedom,${result.tTest.degreesOfFreedom}`,
    `p-value,${result.tTest.pValue}`,
    `Significant (α=0.05),${result.tTest.isSignificant ? "Yes" : "No"}`,
    `Cohen's d,${result.effectSize.cohensD}`,
    `Effect Size Interpretation,${result.effectSize.interpretation}`,
    "",
    "Metadata",
    `Generated At,${new Date().toISOString()}`,
    `Total Comparisons,${metadata.totalComparisons}`,
    `Date Range,${metadata.dateRange}`,
  ];

  const filePath = join(outputDir, "statistical-analysis-results.csv");
  writeFileSync(filePath, csvLines.join("\n"), "utf-8");
  console.log(`✓ CSV export saved to: ${filePath}`);
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log("\n🔬 Starting Statistical Analysis...\n");

    // Fetch all comparison results from database
    console.log("📊 Loading comparison results from database...");
    const comparisons = await prisma.comparisonResult.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (comparisons.length < 2) {
      console.error(
        "❌ Error: Need at least 2 comparison results for statistical analysis"
      );
      console.log(`   Found: ${comparisons.length} comparison(s)`);
      process.exit(1);
    }

    console.log(`✓ Loaded ${comparisons.length} comparison results\n`);

    // Extract AI and baseline scores
    const aiScores = comparisons.map((c) => c.aiOverallScore);
    const baselineScores = comparisons.map((c) => c.baselineOverallScore);

    // Perform statistical analysis
    console.log("🧮 Running statistical tests...\n");
    const results = performAnalysis(aiScores, baselineScores);

    // Prepare metadata
    const metadata = {
      totalComparisons: comparisons.length,
      dateRange:
        comparisons.length > 0
          ? `${comparisons[0].createdAt.toISOString().split("T")[0]} to ${comparisons[comparisons.length - 1].createdAt.toISOString().split("T")[0]}`
          : "N/A",
    };

    // Print console report
    printReport(results, metadata);

    // Export to files
    const outputDir = join(__dirname, "..");
    console.log("\n📁 Exporting results...\n");
    exportToJSON(results, metadata, outputDir);
    exportToCSV(results, metadata, outputDir);

    console.log("\n✅ Statistical analysis complete!\n");
  } catch (error) {
    console.error("\n❌ Error during statistical analysis:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute main function
main();
