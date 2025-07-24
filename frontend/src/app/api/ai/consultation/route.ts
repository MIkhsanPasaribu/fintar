/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

interface ConsultationRequest {
  userId: string;
  sessionId: string;
  industryType: string;
  consultationType:
    | "strategy"
    | "operations"
    | "financial"
    | "technology"
    | "marketing"
    | "general";
  businessData: Record<string, any>;
  specificQuestions?: string[];
  objectives?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      industryType = "general",
      consultationType = "general",
      businessData,
      userId,
      sessionId,
      specificQuestions,
      objectives,
    } = body;

    if (!businessData || typeof businessData !== "object") {
      return NextResponse.json(
        { error: "Business data is required" },
        { status: 400 }
      );
    }

    const consultationRequest: ConsultationRequest = {
      userId: userId || `user_${Date.now()}`,
      sessionId: sessionId || `session_${Date.now()}`,
      industryType,
      consultationType,
      businessData,
      specificQuestions,
      objectives,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/ai/consultation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultationRequest),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const consultation = await response.json();
      return NextResponse.json(consultation);
    } catch (backendError) {
      console.error("Backend consultation error:", backendError);

      // Fallback consultation response
      return NextResponse.json({
        consultationId: `fallback_${Date.now()}`,
        analysis: `Berdasarkan data bisnis ${industryType} yang Anda berikan, berikut analisis singkat dalam mode offline.`,
        recommendations: [
          {
            category: "strategy",
            priority: "high",
            title: "Evaluasi Strategi Bisnis",
            description:
              "Lakukan review mendalam terhadap strategi bisnis saat ini",
            actionItems: [
              "Analisis kompetitor dan posisi pasar",
              "Evaluasi value proposition",
              "Review target market dan segmentasi",
            ],
          },
          {
            category: "operations",
            priority: "medium",
            title: "Optimalisasi Operasional",
            description:
              "Tingkatkan efisiensi operasional untuk mengurangi cost",
            actionItems: [
              "Audit proses bisnis utama",
              "Implementasi teknologi yang tepat",
              "Training team untuk produktivitas",
            ],
          },
        ],
        implementationPlan: [
          {
            phase: "Fase 1: Analisis",
            duration: "2-4 minggu",
            tasks: ["Audit kondisi saat ini", "Identifikasi gap dan peluang"],
          },
          {
            phase: "Fase 2: Perencanaan",
            duration: "3-6 minggu",
            tasks: ["Buat roadmap implementasi", "Alokasi resources"],
          },
        ],
        riskAssessment:
          "Risiko moderat dengan implementasi bertahap yang direkomendasikan.",
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Consultation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const industryType = searchParams.get("industry");
  const userId = searchParams.get("userId");
  const sessionId = searchParams.get("sessionId");

  if (industryType && userId && sessionId) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/ai/consultation/industry-insights/${industryType}?userId=${userId}&sessionId=${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const insights = await response.json();
        return NextResponse.json(insights);
      }
    } catch (error) {
      console.error("Failed to get industry insights:", error);
    }

    // Fallback insights
    return NextResponse.json({
      industryType,
      insights: [
        `Tren terkini di industri ${industryType} menunjukkan pertumbuhan yang stabil`,
        "Digitalisasi menjadi kunci kompetitif utama",
        "Customer experience semakin menjadi diferensiator",
      ],
      recommendations: [
        "Investasi dalam teknologi digital",
        "Fokus pada customer satisfaction",
        "Bangun partnership strategis",
      ],
      fallback: true,
    });
  }

  return NextResponse.json({
    status: "available",
    consultationTypes: [
      "strategy",
      "operations",
      "financial",
      "technology",
      "marketing",
      "general",
    ],
    industries: [
      "teknologi",
      "retail",
      "manufaktur",
      "jasa",
      "keuangan",
      "pendidikan",
      "kesehatan",
      "general",
    ],
  });
}
