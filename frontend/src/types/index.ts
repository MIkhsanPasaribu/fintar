/* eslint-disable @typescript-eslint/no-explicit-any */
// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  role: "CLIENT" | "CONSULTANT" | "ADMIN";
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Consultant Types
export interface Consultant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  specialization: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  isActive: boolean;
  bio?: string;
  certifications?: string[];
  languages?: string[];
  timeZone?: string;
  availability?: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  consultantId: string;
  consultant?: Consultant;
  type: "CONSULTATION" | "FOLLOW_UP" | "EMERGENCY";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  duration: number;
  price: number;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

// Financial Data Types
export interface FinancialData {
  id: string;
  userId: string;
  type: "INCOME" | "EXPENSE" | "INVESTMENT" | "DEBT" | "ASSET";
  category: string;
  amount: number;
  currency: string;
  description?: string;
  date: Date;
  recurring?: boolean;
  frequency?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense" | "investment" | "transfer";
  category?: string;
  description: string;
  amount: number;
  date: string;
  accountId?: string;
  tags?: string[];
  metadata?: {
    location?: string;
    notes?: string;
    attachments?: string[];
    recurring?: boolean;
    recurringPeriod?: "daily" | "weekly" | "monthly" | "yearly";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: "income" | "expense" | "investment";
  color: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "checking" | "savings" | "investment" | "credit" | "cash";
  balance: number;
  currency: string;
  isActive: boolean;
  metadata?: {
    bankName?: string;
    accountNumber?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Chat Types
export interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  type?:
    | "GENERAL"
    | "FINANCIAL_ADVICE"
    | "INVESTMENT_HELP"
    | "DEBT_ASSISTANCE"
    | "BUDGET_PLANNING";
  status?: "ACTIVE" | "ARCHIVED" | "EXPIRED";
  metadata?: Record<string, any>;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// AI Types
export interface AIAnalysisResult {
  analysisId: string;
  summary: string;
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  generatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AICapabilities {
  features: string[];
  models: string[];
  languages: string[];
  maxTokens: number;
  supportedFormats: string[];
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agreeToTerms: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  fallback?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard Types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  monthlyGrowth: number;
  financialHealthScore: number;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  category?: string;
  targetDate?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type:
    | "BOOKING_CONFIRMATION"
    | "CONSULTATION_REMINDER"
    | "NEW_MESSAGE"
    | "SYSTEM_UPDATE";
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  consultantId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// UI Component Types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  variant: "success" | "danger" | "warning" | "info";
  duration?: number;
}

// Education Types
export interface EducationContent {
  id: string;
  title: string;
  description: string;
  type: "ARTICLE" | "VIDEO" | "QUIZ" | "INTERACTIVE";
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: number; // in minutes
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  author: string;
  rating: number;
  totalRatings: number;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  // User-specific fields
  isCompleted?: boolean;
  progress?: number;
  isBookmarked?: boolean;
  userRating?: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  totalSteps: number;
  estimatedDuration: number;
  thumbnail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // User-specific fields
  completedSteps?: number;
  progress?: number;
  enrolledAt?: string;
  completedAt?: string;
  steps: LearningStep[];
}

export interface LearningStep {
  id: string;
  pathId: string;
  contentId: string;
  content: EducationContent;
  order: number;
  isRequired: boolean;
  // User-specific fields
  isCompleted?: boolean;
  completedAt?: string;
}

export interface EducationProgress {
  userId: string;
  contentId: string;
  progress: number; // 0-100
  timeSpent: number; // in minutes
  lastAccessedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  pathId: string;
  learningPath: LearningPath;
  issueDate: string;
  certificateNumber: string;
  isVerified: boolean;
  pdfUrl?: string;
}
