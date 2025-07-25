"use client";

import React from "react";

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModalHeader({
  children,
  className = "",
}: ModalHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  );
}
