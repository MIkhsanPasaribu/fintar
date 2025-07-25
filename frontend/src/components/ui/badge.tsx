"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses = {
  primary: "bg-primary-100 text-primary-700 border-primary-200",
  secondary: "bg-neutral-100 text-neutral-700 border-neutral-200",
  success: "bg-success-100 text-success-700 border-success-200",
  warning: "bg-warning-100 text-warning-700 border-warning-200",
  danger: "bg-danger-100 text-danger-700 border-danger-200",
  info: "bg-info-100 text-info-700 border-info-200",
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

export default function Badge({
  children,
  variant = "primary",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
