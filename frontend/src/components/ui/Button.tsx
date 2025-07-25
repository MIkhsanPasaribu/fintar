import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold shadow-sm border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#003D82] text-white border-[#003D82] shadow-md hover:bg-[#0052CC] hover:shadow-lg hover:shadow-blue-500/25 focus-visible:ring-[#0052CC]",
        destructive:
          "bg-[#D32F2F] text-white border-[#D32F2F] shadow-md hover:bg-[#B71C1C] hover:shadow-lg hover:shadow-red-500/25 focus-visible:ring-[#D32F2F]",
        outline:
          "border-2 border-[#0052CC] bg-white text-[#0052CC] font-semibold shadow-sm hover:bg-[#0052CC] hover:text-white hover:shadow-md hover:shadow-blue-500/20 focus-visible:ring-[#0052CC]",
        secondary:
          "bg-[#FFB800] text-[#0A1628] border-[#FFB800] shadow-md hover:bg-[#F5A623] hover:shadow-lg hover:shadow-yellow-500/25 focus-visible:ring-[#FFB800]",
        ghost:
          "bg-transparent text-[#37474F] border-transparent hover:bg-[#F5F7FA] hover:text-[#0A1628] hover:shadow-sm focus-visible:ring-[#0052CC]",
        link: "text-[#0052CC] border-transparent underline-offset-4 hover:underline hover:text-[#003D82] focus-visible:ring-[#0052CC]",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 rounded-md px-4 py-1.5 text-xs",
        lg: "h-12 rounded-xl px-8 py-3 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
