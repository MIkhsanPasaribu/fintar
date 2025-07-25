"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownProps {
  children: React.ReactNode;
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}

interface DropdownItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const DropdownContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownContext);

  return (
    <button
      className={cn("inline-flex items-center justify-center", className)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
    </button>
  );
}

export function DropdownContent({
  children,
  className,
  align = "start",
}: DropdownContentProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={cn(
            "absolute top-full mt-2 z-50 min-w-[200px] rounded-xl border border-neutral-200 bg-white shadow-lg",
            alignClasses[align],
            className
          )}
        >
          <div className="py-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DropdownItem({
  children,
  className,
  onClick,
  disabled,
}: DropdownItemProps) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
      setIsOpen(false);
    }
  };

  return (
    <button
      className={cn(
        "w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-neutral-50 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
