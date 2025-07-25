import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "premium" | "info" | "success" | "warning" | "danger";
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className = "", variant = "default", hover = true, children, ...props },
    ref
  ) => {
    const baseClasses = "rounded-xl shadow-sm transition-all duration-200";

    const hoverClasses = hover ? "hover:shadow-hover" : "";

    const variants = {
      default: "bg-white border border-neutral-200",
      premium:
        "bg-gradient-to-br from-accent-50 to-accent-100 border border-accent",
      info: "bg-primary-25 border border-primary",
      success: "bg-success-50 border border-success",
      warning: "bg-warning-50 border border-warning",
      danger: "bg-danger-50 border border-danger",
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], hoverClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 border-b border-neutral-200", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-6 py-4", className)} {...props}>
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 border-t border-neutral-200", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter };
