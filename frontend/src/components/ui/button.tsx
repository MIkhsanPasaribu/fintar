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
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl",
          {
            // Primary Button - Bright Gold (#FFD700) + Dark Text (#1C1C1C)
            "bg-accent-400 hover:bg-accent-500 text-text-primary border-2 border-accent-400 hover:border-accent-500":
              variant === "default",
            // Secondary Button - Primary Teal Blue (#00809D) + Cream Text (#FCF8DD)
            "bg-secondary-400 border-2 border-secondary-400 text-primary-50 hover:bg-secondary-500 hover:border-secondary-500":
              variant === "secondary",
            // Accent Button - Success Green (#2E8B57) + Cream Text (#FCF8DD)
            "bg-supporting-400 text-primary-50 hover:bg-supporting-500":
              variant === "accent",
            // Outline Button - Teal outline
            "border-2 border-secondary-400 bg-transparent hover:bg-secondary-50 text-secondary-400 hover:text-secondary-500 hover:border-secondary-500":
              variant === "outline",
            // Ghost Button - Subtle hover
            "hover:bg-neutral-300 text-text-description hover:text-text-body shadow-none hover:shadow-md":
              variant === "ghost",
            // Destructive Button - Crimson (#DC143C) + Cream Text (#FCF8DD)
            "bg-danger-400 text-primary-50 hover:bg-danger-500":
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
