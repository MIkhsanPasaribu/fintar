/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

interface FinancialAnalysisRequest {
  userId: string;
  sessionId: string;
  analysisType: "portfolio" | "budget" | "forecast" | "risk" | "comprehensive";
  data: Record<string, any>;
  preferences?: {
    riskTolerance: "conservative" | "moderate" | "aggressive";
    investmentHorizon: "short" | "medium" | "long";
    goals: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      analysisType = "comprehensive",
      data,
      userId,
      sessionId,
      preferences,
    } = body;

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Financial data is required" },
        { status: 400 }
      );
    }

    const analysisRequest: FinancialAnalysisRequest = {
      userId: userId || `user_${Date.now()}`,
      sessionId: sessionId || `session_${Date.now()}`,
      analysisType,
      data,
      preferences,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/ai/financial/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analysisRequest),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const analysis = await response.json();
      return NextResponse.json(analysis);
    } catch (backendError) {
      console.error("Backend financial analysis error:", backendError);

      // Fallback analysis
      return NextResponse.json({
        analysisId: `fallback_${Date.now()}`,
        summary:
          "Analisis keuangan sedang dalam mode offline. Backend AI service tidak tersedia saat ini.",
        recommendations: [
          "Pastikan Anda memiliki dana darurat 6-12 bulan pengeluaran",
          "Diversifikasi investasi dengan alokasi yang sesuai profil risiko",
          "Review dan optimalisasi pengeluaran rutin bulanan",
        ],
        riskLevel: "moderate",
        confidence: 0.5,
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Financial analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/ai/capabilities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const capabilities = await response.json();
      return NextResponse.json({
        status: "available",
        analysisTypes: [
          "portfolio",
          "budget",
          "forecast",
          "risk",
          "comprehensive",
        ],
        capabilities,
      });
    }
  } catch (error) {
    console.error("Failed to get financial analysis capabilities:", error);
  }

  return NextResponse.json({
    status: "fallback",
    analysisTypes: ["portfolio", "budget", "forecast", "risk", "comprehensive"],
    message: "Financial analysis available in offline mode",
  });
}
