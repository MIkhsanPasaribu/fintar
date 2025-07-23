import { create } from "zustand";
import type { DashboardData } from "@/types";

interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  updateDashboardData: (data: Partial<DashboardData>) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboardData: null,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();

      if (result.success) {
        set({ dashboardData: result.data, isLoading: false });
      } else {
        set({
          error: result.error || "Failed to fetch dashboard data",
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        isLoading: false,
      });
    }
  },

  updateDashboardData: (data) => {
    const currentData = get().dashboardData;
    if (currentData) {
      set({ dashboardData: { ...currentData, ...data } });
    }
  },
}));
