import { create } from "zustand";
import { FinancialData, FinancialGoal, Transaction } from "@/types";

interface FinancialState {
  // Financial data
  financialData: FinancialData[];
  goals: FinancialGoal[];
  transactions: Transaction[];

  // Summary data
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  investments: number;

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  setFinancialData: (data: FinancialData[]) => void;
  addFinancialData: (data: FinancialData) => void;
  updateFinancialData: (id: string, data: Partial<FinancialData>) => void;
  removeFinancialData: (id: string) => void;

  setGoals: (goals: FinancialGoal[]) => void;
  addGoal: (goal: FinancialGoal) => void;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  removeGoal: (id: string) => void;

  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;

  updateSummary: (summary: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    investments: number;
  }) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed values
  getSavingsRate: () => number;
  getExpenseRatio: () => number;
  getCashFlow: () => number;
  getNetWorth: () => number;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  // Initial state
  financialData: [],
  goals: [],
  transactions: [],
  totalBalance: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  investments: 0,
  loading: false,
  error: null,

  // Financial data actions
  setFinancialData: (data) => set({ financialData: data }),

  addFinancialData: (data) =>
    set((state) => ({
      financialData: [...state.financialData, data],
    })),

  updateFinancialData: (id, data) =>
    set((state) => ({
      financialData: state.financialData.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),

  removeFinancialData: (id) =>
    set((state) => ({
      financialData: state.financialData.filter((item) => item.id !== id),
    })),

  // Goals actions
  setGoals: (goals) => set({ goals }),

  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, goal],
    })),

  updateGoal: (id, goal) =>
    set((state) => ({
      goals: state.goals.map((item) =>
        item.id === id ? { ...item, ...goal } : item
      ),
    })),

  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((item) => item.id !== id),
    })),

  // Transactions actions
  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  // Summary actions
  updateSummary: (summary) => set(summary),

  // Loading and error actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Computed values
  getSavingsRate: () => {
    const { monthlyIncome, monthlyExpenses } = get();
    if (monthlyIncome === 0) return 0;
    return ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
  },

  getExpenseRatio: () => {
    const { monthlyIncome, monthlyExpenses } = get();
    if (monthlyIncome === 0) return 0;
    return (monthlyExpenses / monthlyIncome) * 100;
  },

  getCashFlow: () => {
    const { monthlyIncome, monthlyExpenses } = get();
    return monthlyIncome - monthlyExpenses;
  },

  getNetWorth: () => {
    const { totalBalance, investments } = get();
    return totalBalance + investments;
  },
}));
