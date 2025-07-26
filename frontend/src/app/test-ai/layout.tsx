import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TestAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
