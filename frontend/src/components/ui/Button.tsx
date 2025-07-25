import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

const LoadingSpinner = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl gap-2 whitespace-nowrap";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary-600 focus:ring-primary/20 shadow-sm hover:shadow-md active:scale-95",
      secondary:
        "bg-accent text-text-primary hover:bg-accent-400 focus:ring-accent/20 shadow-sm hover:shadow-md active:scale-95",
      success:
        "bg-success text-white hover:bg-success-600 focus:ring-success/20 shadow-sm hover:shadow-md active:scale-95",
      warning:
        "bg-warning text-white hover:bg-warning-600 focus:ring-warning/20 shadow-sm hover:shadow-md active:scale-95",
      danger:
        "bg-danger text-white hover:bg-danger-600 focus:ring-danger/20 shadow-sm hover:shadow-md active:scale-95",
      outline:
        "border border-neutral-200 bg-white hover:bg-neutral-50 focus:ring-primary/20 text-text-primary hover:border-primary-200",
      ghost:
        "bg-transparent hover:bg-neutral-50 focus:ring-primary/20 text-text-primary",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && <LoadingSpinner size={size} />}
        {!loading && icon && iconPosition === "left" && icon}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
