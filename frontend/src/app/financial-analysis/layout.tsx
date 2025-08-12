import DashboardLayout from "@/components/layout/DashboardLayout";

export default function FinancialAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
