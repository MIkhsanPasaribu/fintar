/**
 * useComparison Hook
 *
 * Custom React hook for Comparison API integration
 * Handles AI vs Baseline comparison data fetching and state management
 *
 * Features:
 * - Run new comparisons
 * - Get comparison statistics
 * - Get statistical analysis (t-test, effect size, CI)
 * - Get user-specific comparisons
 * - Loading and error state management
 * - JWT authentication
 *
 * @author Fintar Team
 */

import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance with auth interceptor
const createApiClient = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
  });

  // Add auth token to requests
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const apiClient = createApiClient();

/**
 * Comparison Result Interface
 */
export interface ComparisonResult {
  id: string;
  userId: string;
  question: string;
  userContext: any;
  aiResponse: string;
  baselineResponse: string;
  aiScores: {
    accuracy: number;
    relevance: number;
    actionability: number;
    clarity: number;
    completeness: number;
  };
  baselineScores: {
    accuracy: number;
    relevance: number;
    actionability: number;
    clarity: number;
    completeness: number;
  };
  aiOverallScore: number;
  baselineOverallScore: number;
  winner: "AI_WINS" | "BASELINE_WINS" | "TIE";
  scoreDifference: number;
  evaluationNotes: string;
  createdAt: string;
}

/**
 * Comparison Statistics Interface
 */
export interface ComparisonStatistics {
  totalComparisons: number;
  aiWins: number;
  baselineWins: number;
  ties: number;
  aiWinRate: number;
  averageScores: {
    ai: {
      overall: number;
      accuracy: number;
      relevance: number;
      actionability: number;
      clarity: number;
      completeness: number;
    };
    baseline: {
      overall: number;
      accuracy: number;
      relevance: number;
      actionability: number;
      clarity: number;
      completeness: number;
    };
  };
  medianScores: {
    ai: number;
    baseline: number;
  };
  standardDeviations: {
    ai: number;
    baseline: number;
  };
}

/**
 * Statistical Analysis Result Interface
 */
export interface StatisticalAnalysisResult {
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
  dataRange?: {
    startDate: string;
    endDate: string;
  };
  timestamp?: string;
}

/**
 * Hook State Interface
 */
interface UseComparisonState {
  // Data
  comparisonResult: ComparisonResult | null;
  statistics: ComparisonStatistics | null;
  statisticalAnalysis: StatisticalAnalysisResult | null;
  userComparisons: ComparisonResult[];

  // Loading states
  isRunning: boolean;
  isLoadingStats: boolean;
  isLoadingAnalysis: boolean;
  isLoadingUserComparisons: boolean;

  // Error states
  error: string | null;

  // Methods
  runComparison: (
    question: string,
    userContext?: any
  ) => Promise<ComparisonResult | null>;
  getComparisonStatistics: (
    startDate?: string,
    endDate?: string
  ) => Promise<ComparisonStatistics | null>;
  getStatisticalAnalysis: (
    startDate?: string,
    endDate?: string
  ) => Promise<StatisticalAnalysisResult | null>;
  getUserComparisons: (userId: string) => Promise<ComparisonResult[]>;
  clearError: () => void;
}

/**
 * useComparison Hook
 */
export function useComparison(): UseComparisonState {
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [statistics, setStatistics] = useState<ComparisonStatistics | null>(
    null
  );
  const [statisticalAnalysis, setStatisticalAnalysis] =
    useState<StatisticalAnalysisResult | null>(null);
  const [userComparisons, setUserComparisons] = useState<ComparisonResult[]>(
    []
  );

  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingUserComparisons, setIsLoadingUserComparisons] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Run new AI vs Baseline comparison
   */
  const runComparison = useCallback(
    async (
      question: string,
      userContext?: any
    ): Promise<ComparisonResult | null> => {
      setIsRunning(true);
      setError(null);

      try {
        const response = await apiClient.post("/api/comparison/run", {
          question,
          userContext: userContext || {},
        });

        setComparisonResult(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to run comparison";
        setError(errorMessage);
        console.error("Comparison error:", err);
        return null;
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  /**
   * Get comparison statistics (aggregated metrics)
   */
  const getComparisonStatistics = useCallback(
    async (
      startDate?: string,
      endDate?: string
    ): Promise<ComparisonStatistics | null> => {
      setIsLoadingStats(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const url = `/api/comparison/statistics${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await apiClient.get(url);

        setStatistics(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to get statistics";
        setError(errorMessage);
        console.error("Statistics error:", err);
        return null;
      } finally {
        setIsLoadingStats(false);
      }
    },
    []
  );

  /**
   * Get statistical analysis (t-test, Cohen's d, CI)
   */
  const getStatisticalAnalysis = useCallback(
    async (
      startDate?: string,
      endDate?: string
    ): Promise<StatisticalAnalysisResult | null> => {
      setIsLoadingAnalysis(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const url = `/api/comparison/statistical-analysis${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await apiClient.get(url);

        setStatisticalAnalysis(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to get statistical analysis";
        setError(errorMessage);
        console.error("Statistical analysis error:", err);
        return null;
      } finally {
        setIsLoadingAnalysis(false);
      }
    },
    []
  );

  /**
   * Get user-specific comparisons
   */
  const getUserComparisons = useCallback(
    async (userId: string): Promise<ComparisonResult[]> => {
      setIsLoadingUserComparisons(true);
      setError(null);

      try {
        const response = await apiClient.get(`/api/comparison/user/${userId}`);
        setUserComparisons(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to get user comparisons";
        setError(errorMessage);
        console.error("User comparisons error:", err);
        return [];
      } finally {
        setIsLoadingUserComparisons(false);
      }
    },
    []
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    comparisonResult,
    statistics,
    statisticalAnalysis,
    userComparisons,

    // Loading states
    isRunning,
    isLoadingStats,
    isLoadingAnalysis,
    isLoadingUserComparisons,

    // Error state
    error,

    // Methods
    runComparison,
    getComparisonStatistics,
    getStatisticalAnalysis,
    getUserComparisons,
    clearError,
  };
}

export default useComparison;
