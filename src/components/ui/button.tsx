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
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-primary-600 text-white hover:bg-primary-700":
              variant === "default",
            "bg-secondary-600 text-white hover:bg-secondary-700":
              variant === "secondary",
            "bg-accent-500 text-white hover:bg-accent-600":
              variant === "accent",
            "border border-neutral-300 bg-transparent hover:bg-neutral-50":
              variant === "outline",
            "hover:bg-neutral-100": variant === "ghost",
            "bg-error text-white hover:bg-red-700": variant === "destructive",
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
