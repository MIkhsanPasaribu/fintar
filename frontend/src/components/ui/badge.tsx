import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105",
  {
    variants: {
      variant: {
        default: "bg-blue-600 border-blue-500 text-white shadow-lg",
        secondary:
          "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200",
        destructive: "bg-red-600 border-red-500 text-white shadow-lg",
        outline: "text-blue-600 border-blue-300 hover:bg-blue-50",
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
