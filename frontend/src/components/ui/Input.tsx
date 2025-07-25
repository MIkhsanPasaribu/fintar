import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", label, error, success, icon, type = "text", ...props },
    ref
  ) => {
    const baseClasses =
      "w-full px-4 py-3 border rounded-xl bg-white text-text-primary placeholder:text-text-metadata focus:outline-none focus:ring-2 transition-all duration-200";

    const statusClasses = error
      ? "border-danger focus:ring-danger/20 focus:border-danger"
      : success
      ? "border-success focus:ring-success/20 focus:border-success"
      : "border-neutral-200 focus:ring-primary/20 focus:border-primary hover:border-primary-200";

    const inputClasses = icon ? "pl-12" : "";

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-metadata">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(baseClasses, statusClasses, inputClasses, className)}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-danger flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {success && !error && (
          <p className="text-sm text-success flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Valid
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
