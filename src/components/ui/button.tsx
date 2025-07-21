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
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105",
          {
            // Primary Button - Dark Theme
            "bg-primary-500 text-white hover:bg-primary-700 shadow-neon-primary hover:shadow-primary-glow":
              variant === "default",
            // Secondary Button - Dark Theme
            "bg-secondary-500 text-white hover:bg-secondary-700 shadow-secondary-glow":
              variant === "secondary",
            // Accent Button - Dark Theme
            "bg-accent-500 text-neutral-500 hover:bg-accent-700 shadow-neon-accent":
              variant === "accent",
            // Outline Button - Dark Theme
            "border-2 border-primary-500 bg-transparent hover:bg-primary-500/10 text-primary-600 hover:text-primary-500 hover:shadow-neon-primary":
              variant === "outline",
            // Ghost Button - Dark Theme
            "hover:bg-primary-500/10 text-font-light hover:text-primary-600":
              variant === "ghost",
            // Destructive Button
            "bg-error text-white hover:bg-red-700 shadow-md":
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
