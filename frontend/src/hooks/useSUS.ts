import { useState } from "react";
import { SUSResponses } from "@/lib/sus-questions";

interface SUSSubmitResponse {
  id: string;
  userId: string;
  sessionId: string;
  totalScore: number;
  grade: string;
  completedAt: string;
  responses: SUSResponses;
}

interface SUSStatistics {
  totalResponses: number;
  averageScore: number;
  medianScore: number;
  minScore: number;
  maxScore: number;
  standardDeviation: number;
  gradeDistribution: Record<string, number>;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export function useSUS() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitSUS = async (
    sessionId: string,
    responses: SUSResponses
  ): Promise<SUSSubmitResponse | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sus/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId,
            ...responses,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit SUS");
      }

      const data: SUSSubmitResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error submitting SUS:", err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSUSStatistics = async (): Promise<SUSStatistics | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sus/statistics`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch SUS statistics");
      }

      const data: SUSStatistics = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching SUS statistics:", err);
      return null;
    }
  };

  const getUserSUSHistory = async (
    userId: string
  ): Promise<SUSSubmitResponse[] | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sus/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user SUS history");
      }

      const data: SUSSubmitResponse[] = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching user SUS history:", err);
      return null;
    }
  };

  return {
    submitSUS,
    getSUSStatistics,
    getUserSUSHistory,
    isSubmitting,
    error,
  };
}
