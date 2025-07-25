"use client";

import React from "react";

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModalFooter({
  children,
  className = "",
}: ModalFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-neutral-200 flex justify-end space-x-3 ${className}`}
    >
      {children}
    </div>
  );
}
