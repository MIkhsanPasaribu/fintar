import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration
const mockDashboardData = {
  totalIncome: 15000000,
  totalExpenses: 8500000,
  balance: 6500000,
  monthlyIncome: 5000000,
  monthlyExpenses: 3200000,
  budgetUsage: [
    { category: "Makanan", limit: 1500000, spent: 1200000, percentage: 80 },
    { category: "Transportasi", limit: 800000, spent: 650000, percentage: 81 },
    { category: "Hiburan", limit: 500000, spent: 320000, percentage: 64 },
    { category: "Kesehatan", limit: 600000, spent: 180000, percentage: 30 },
  ],
  recentTransactions: [
    {
      id: "1",
      userId: "1",
      amount: -250000,
      type: "expense" as const,
      category: "Makanan",
      description: "Groceries",
      date: new Date("2025-01-20"),
    },
    {
      id: "2",
      userId: "1",
      amount: 5000000,
      type: "income" as const,
      category: "Gaji",
      description: "Monthly Salary",
      date: new Date("2025-01-15"),
    },
    {
      id: "3",
      userId: "1",
      amount: -50000,
      type: "expense" as const,
      category: "Transportasi",
      description: "Taxi",
      date: new Date("2025-01-18"),
    },
  ],
  financialGoals: [
    {
      id: "1",
      userId: "1",
      title: "Dana Darurat",
      targetAmount: 20000000,
      currentAmount: 12000000,
      deadline: new Date("2025-12-31"),
      category: "emergency" as const,
      priority: "high" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  cashflowData: [
    { month: "Jan", income: 5000000, expenses: 3200000, balance: 1800000 },
    { month: "Feb", income: 5200000, expenses: 3100000, balance: 2100000 },
    { month: "Mar", income: 4800000, expenses: 3500000, balance: 1300000 },
    { month: "Apr", income: 5100000, expenses: 2900000, balance: 2200000 },
    { month: "May", income: 5300000, expenses: 3300000, balance: 2000000 },
    { month: "Jun", income: 5000000, expenses: 3200000, balance: 1800000 },
  ],
};

export async function GET() {
  try {
    // In a real application, you would:
    // 1. Authenticate the user from the JWT token
    // 2. Get user ID from the token
    // 3. Fetch dashboard data from the database
    // 4. Calculate aggregated statistics

    return NextResponse.json({
      success: true,
      data: mockDashboardData,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real application, you would:
    // 1. Validate the input data
    // 2. Update user's financial data
    // 3. Recalculate dashboard statistics
    // 4. Return updated data

    console.log("Dashboard update request:", body);

    return NextResponse.json({
      success: true,
      message: "Dashboard data updated successfully",
    });
  } catch (error) {
    console.error("Dashboard update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update dashboard data" },
      { status: 500 }
    );
  }
}
