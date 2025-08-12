"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function InvestmentAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
