import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2 transform hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "bg-secondary-400 border-secondary-400 text-primary-50 shadow-lg",
        secondary:
          "bg-primary-100 border-accent-500 text-text-body hover:bg-primary-200",
        destructive:
          "bg-danger-400 border-danger-400 text-primary-50 shadow-lg",
        outline:
          "text-secondary-400 border-secondary-400 hover:bg-secondary-50",
        success:
          "bg-supporting-400 border-supporting-400 text-primary-50 shadow-lg",
        warning: "bg-accent-600 border-accent-600 text-text-primary shadow-lg",
        info: "bg-info-400 border-info-400 text-primary-50 shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
