import DashboardLayout from "@/components/layout/DashboardLayout";

export default function MarketMonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
