/**
 * Analytics Types
 * Type definitions for performance metrics and analytics data
 */

export interface PerformanceMetrics {
  dateRange: {
    start: Date;
    end: Date;
  };
  responseTime: ResponseTimeStats;
  tokenUsage: TokenUsageStats;
  successRate: SuccessRateStats;
  errors: ErrorDistribution[];
  qualityScores: QualityScoreStats;
}

export interface ResponseTimeStats {
  average: number;
  median: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  count: number;
}

export interface TokenUsageStats {
  totalTokens: number;
  totalRequests: number;
  averageTokensPerRequest: number;
  estimatedCost: number;
}

export interface SuccessRateStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
}

export interface ErrorDistribution {
  type: string;
  count: number;
}

export interface QualityScoreStats {
  count: number;
  averageOverallScore: number;
  averageScores: {
    accuracy: number;
    relevance: number;
    actionability: number;
    clarity: number;
    completeness: number;
    personalization: number;
  };
}

export interface DailyMetrics {
  date: string;
  requests: number;
  successful: number;
  failed: number;
  successRate: number;
  avgResponseTime: number;
}
