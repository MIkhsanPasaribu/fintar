import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "accent"
    | "outline"
    | "ghost"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105",
          {
            // Primary Button - Using Action Accent (#EE9B00)
            "bg-orange-500 text-primary-base hover:bg-orange-600 shadow-lg hover:shadow-xl":
              variant === "default",
            // Secondary Button - Using Strong Trust Teal
            "bg-teal-dark text-white hover:bg-teal-light shadow-lg hover:shadow-teal-dark/30":
              variant === "secondary",
            // Accent Button - Using Soft Supportive Teal
            "bg-teal-light text-primary-base hover:bg-teal-dark shadow-lg hover:shadow-teal-light/30":
              variant === "accent",
            // Outline Button - Using Primary Light border
            "border-2 border-primary-light bg-transparent hover:bg-primary-light/10 text-teal-light hover:text-teal-dark hover:shadow-lg":
              variant === "outline",
            // Ghost Button - Subtle hover
            "hover:bg-primary-light/10 text-font-secondary hover:text-font-primary":
              variant === "ghost",
            // Destructive Button - Using Warning/Danger color
            "bg-danger text-white hover:bg-danger/90 shadow-lg":
              variant === "destructive",
            // Sizes
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
