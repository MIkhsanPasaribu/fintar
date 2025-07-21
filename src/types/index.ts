// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "consultant";
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Financial Data Types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: Date;
  recurring?: boolean;
  recurringPeriod?: "weekly" | "monthly" | "yearly";
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  createdAt: Date;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: "emergency" | "investment" | "savings" | "debt" | "other";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Types
export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetUsage: BudgetUsage[];
  recentTransactions: Transaction[];
  financialGoals: FinancialGoal[];
  cashflowData: CashflowData[];
}

export interface BudgetUsage {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
}

export interface CashflowData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  topic: string;
  createdAt: Date;
  updatedAt: Date;
}

// Education Types
export interface EducationContent {
  id: string;
  title: string;
  description: string;
  content: string;
  type: "article" | "video" | "quiz";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  points: number;
  thumbnail?: string;
  videoUrl?: string;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  category: string;
  points: number;
  duration: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  contentId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  completedAt?: Date;
}

// Consultation Types
export interface Consultation {
  id: string;
  userId: string;
  consultantId: string;
  topic: string;
  description: string;
  status: "pending" | "scheduled" | "ongoing" | "completed" | "cancelled";
  scheduledAt: Date;
  duration: number;
  price: number;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultant {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  experience: number;
  rating: number;
  pricePerHour: number;
  availability: ConsultantAvailability[];
  avatar?: string;
  bio: string;
  credentials: string[];
}

export interface ConsultantAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
