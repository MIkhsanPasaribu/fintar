"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "default" | "primary" | "success";
  className?: string;
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  className,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const variants = {
    default: "text-text-metadata",
    primary: "text-primary",
    success: "text-success",
  };

  return (
    <motion.svg
      className={cn("animate-spin", sizes[size], variants[variant], className)}
      fill="none"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );
}

export function Loading({
  size = "md",
  text,
  variant = "default",
  className,
}: LoadingProps) {
  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <LoadingSpinner size={size} variant={variant} />
      {text && (
        <span className="text-text-description text-sm font-medium">
          {text}
        </span>
      )}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-neutral-200 rounded"></div>
        <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="mt-4 text-text-description">Loading...</p>
      </div>
    </div>
  );
}
