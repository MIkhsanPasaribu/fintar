import { Module } from "@nestjs/common";
import { EvaluationService } from "./evaluation.service";
import { EvaluationController } from "./evaluation.controller";
import { ComparisonService } from "./comparison.service";
import { ComparisonController } from "./comparison.controller";
import { StatisticalAnalysisService } from "./statistical-analysis.service";
import { CommonModule } from "../common/common.module";
import { BaselineModule } from "../baseline/baseline.module";

/**
 * Evaluation Module
 *
 * Handles AI response quality evaluation using LLM-as-a-Judge methodology.
 *
 * Features:
 * - Quality evaluation across 6 criteria (accuracy, relevance, actionability, clarity, completeness, personalization)
 * - Performance metrics tracking
 * - Evaluation statistics and analytics
 * - Integration with Gemini AI for automated evaluation
 * - Comparison framework for AI vs Baseline systems
 * - Statistical analysis (t-test, effect size, confidence intervals)
 *
 * @module EvaluationModule
 */
@Module({
  imports: [CommonModule, BaselineModule],
  controllers: [EvaluationController, ComparisonController],
  providers: [EvaluationService, ComparisonService, StatisticalAnalysisService],
  exports: [EvaluationService, ComparisonService, StatisticalAnalysisService],
})
export class EvaluationModule {}
