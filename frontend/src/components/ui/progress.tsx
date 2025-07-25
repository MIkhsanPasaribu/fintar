"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      variant = "primary",
      size = "md",
      showLabel = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
    };

    const variantClasses = {
      primary: "bg-[#0052CC]",
      success: "bg-[#00C853]",
      warning: "bg-[#FF9800]",
      danger: "bg-[#D32F2F]",
      info: "bg-[#2196F3]",
    };

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        <div
          className={cn(
            "w-full bg-[#E9ECEF] rounded-full overflow-hidden",
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              "h-full transition-all duration-300 ease-out rounded-full",
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between items-center mt-1 text-xs text-[#78909C]">
            <span>{value}</span>
            <span>{max}</span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;
