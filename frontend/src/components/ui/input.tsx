import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-metadata">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-accent-500 bg-primary-100 px-3 py-2 text-sm text-text-body ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 focus-visible:ring-offset-2 focus-visible:border-secondary-400 hover:border-accent-600 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-danger-400 focus-visible:ring-danger-400",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-danger-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
