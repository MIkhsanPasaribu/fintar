"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/theme-context";
import { motion, AnimatePresence } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

export function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<Position>({ x: 0, y: 0 });
  const elementStart = useRef<Position>({ x: 0, y: 0 });

  // Initialize position to bottom right
  useEffect(() => {
    const updatePosition = () => {
      setPosition({
        x: window.innerWidth - 80, // 80px from right edge
        y: window.innerHeight - 80, // 80px from bottom edge
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    elementStart.current = { ...position };
    setShowTooltip(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      const newX = Math.max(
        0,
        Math.min(window.innerWidth - 56, elementStart.current.x + deltaX)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - 56, elementStart.current.y + deltaY)
      );

      setPosition({ x: newX, y: newY });
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleClick = () => {
    if (!isDragging) {
      toggleTheme();
    }
  };

  return null; // Theme toggle disabled for light-only theme
}
