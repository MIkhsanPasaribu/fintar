/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  online?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      fallback,
      firstName,
      lastName,
      size = "md",
      className = "",
      online,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes = {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg",
      xl: "w-16 h-16 text-xl",
    };

    const onlineIndicatorSizes = {
      sm: "w-2.5 h-2.5",
      md: "w-3 h-3",
      lg: "w-3.5 h-3.5",
      xl: "w-4 h-4",
    };

    const displayText =
      fallback ||
      (firstName
        ? getInitials(firstName, lastName)
        : alt
        ? alt.charAt(0).toUpperCase()
        : "?");

    const showImage = src && !imageError;

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-primary text-white font-medium overflow-hidden",
            sizes[size]
          )}
        >
          {showImage ? (
            <img
              src={src}
              alt={alt || `${firstName} ${lastName}`.trim()}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{displayText}</span>
          )}
        </div>

        {online !== undefined && (
          <div
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-white",
              onlineIndicatorSizes[size],
              online ? "bg-success" : "bg-neutral-400"
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
