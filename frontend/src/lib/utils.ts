/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "IDR"
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  return dateObj.toLocaleDateString("id-ID", { ...defaultOptions, ...options });
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function generateId(prefix: string = ""): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}${prefix ? "_" : ""}${timestamp}_${random}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getInitials(firstName: string, lastName?: string): string {
  if (!firstName) return "";

  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";

  return firstInitial + lastInitial;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[0-9]{10,13}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
}

export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getFinancialHealthScore(
  income: number,
  expenses: number,
  savings: number,
  debt: number
): { score: number; level: string; color: string } {
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const debtToIncomeRatio = income > 0 ? (debt / income) * 100 : 0;
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;

  let score = 0;

  // Savings rate scoring (40% weight)
  if (savingsRate >= 20) score += 40;
  else if (savingsRate >= 15) score += 30;
  else if (savingsRate >= 10) score += 20;
  else if (savingsRate >= 5) score += 10;

  // Debt to income ratio scoring (30% weight)
  if (debtToIncomeRatio <= 10) score += 30;
  else if (debtToIncomeRatio <= 20) score += 25;
  else if (debtToIncomeRatio <= 30) score += 15;
  else if (debtToIncomeRatio <= 40) score += 5;

  // Expense ratio scoring (30% weight)
  if (expenseRatio <= 50) score += 30;
  else if (expenseRatio <= 60) score += 25;
  else if (expenseRatio <= 70) score += 15;
  else if (expenseRatio <= 80) score += 5;

  let level: string;
  let color: string;

  if (score >= 80) {
    level = "Excellent";
    color = "text-success";
  } else if (score >= 60) {
    level = "Good";
    color = "text-primary";
  } else if (score >= 40) {
    level = "Fair";
    color = "text-accent";
  } else if (score >= 20) {
    level = "Poor";
    color = "text-warning";
  } else {
    level = "Critical";
    color = "text-danger";
  }

  return { score, level, color };
}
