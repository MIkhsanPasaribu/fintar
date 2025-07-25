/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

// Backend API configuration
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

// Types matching backend interfaces
interface ChatRequest {
  userId: string;
  sessionId: string;
  message: string;
  context?: Record<string, any>;
  chatType?: "general" | "financial" | "consultant" | "support";
}

interface ChatResponse {
  responseId: string;
  message: string;
  confidence: number;
  suggestions?: string[];
  context?: Record<string, any>;
  metadata?: {
    model: string;
    tokens: number;
    responseTime: number;
  };
}

// Generate session ID for user if not provided
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate user ID (in real app, this would come from authentication)
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, sessionId, chatType = "financial" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Prepare request for backend
    const chatRequest: ChatRequest = {
      userId: userId || generateUserId(),
      sessionId: sessionId || generateSessionId(),
      message: message.trim(),
      chatType,
      context: {
        language: "id",
        userType: "individual",
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // Call backend AI service
      const response = await fetch(`${BACKEND_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatRequest),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const aiResponse: ChatResponse = await response.json();

      return NextResponse.json({
        message: aiResponse.message,
        suggestions:
          aiResponse.suggestions || generateFallbackSuggestions(message),
        sessionId: chatRequest.sessionId,
        userId: chatRequest.userId,
        timestamp: new Date().toISOString(),
        metadata: aiResponse.metadata || {
          model: "gemini-2.0-flash",
          tokens: 0,
          responseTime: 0,
        },
      });
    } catch (backendError) {
      console.error("Backend AI service error:", backendError);

      // Fallback to local processing if backend is unavailable
      return NextResponse.json({
        message: generateFallbackResponse(message),
        suggestions: generateFallbackSuggestions(message),
        sessionId: chatRequest.sessionId,
        userId: chatRequest.userId,
        timestamp: new Date().toISOString(),
        metadata: {
          model: "fallback",
          tokens: 0,
          responseTime: 0,
        },
        warning: "Backend AI service unavailable, using fallback response",
      });
    }
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Health check and capabilities endpoint
    const response = await fetch(`${BACKEND_URL}/ai/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const healthData = await response.json();
      return NextResponse.json({
        status: "connected",
        backend: healthData,
        capabilities: await getCapabilities(),
      });
    } else {
      throw new Error("Backend health check failed");
    }
  } catch (error) {
    console.error("Backend connection error:", error);
    return NextResponse.json({
      status: "disconnected",
      message: "AI Chat API is running in fallback mode",
      capabilities: await getCapabilities(),
    });
  }
}

// Helper functions for fallback responses
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("budget") || lowerMessage.includes("anggaran")) {
    return "Untuk membuat budget yang efektif, mulai dengan mencatat semua pemasukan dan pengeluaran selama sebulan. Gunakan aplikasi atau spreadsheet untuk tracking. Terapkan prinsip 50/30/20: 50% untuk kebutuhan pokok, 30% untuk keinginan, dan 20% untuk tabungan serta investasi.";
  } else if (
    lowerMessage.includes("investasi") ||
    lowerMessage.includes("invest")
  ) {
    return "Untuk pemula, saya rekomendasikan memulai dengan reksa dana. Pilih reksa dana campuran atau saham dengan track record minimal 3 tahun. Mulai dengan nominal kecil, misalnya Rp 100.000/bulan, dan tingkatkan secara bertahap. Jangan lupa untuk diversifikasi portofolio Anda.";
  } else if (
    lowerMessage.includes("tabung") ||
    lowerMessage.includes("menabung")
  ) {
    return "Strategi menabung yang efektif: 1) Set target yang spesifik dan realistis, 2) Buat automatic transfer ke rekening tabungan, 3) Pisahkan rekening tabungan dari rekening harian, 4) Cari suku bunga terbaik, 5) Review progress secara berkala.";
  } else if (lowerMessage.includes("hutang") || lowerMessage.includes("debt")) {
    return "Untuk melunasi hutang, gunakan metode 'debt snowball' atau 'debt avalanche'. Snowball: bayar hutang terkecil dulu untuk motivasi. Avalanche: bayar hutang dengan bunga tertinggi dulu untuk efisiensi. Hindari hutang baru dan pertimbangkan sumber pendapatan tambahan.";
  }

  return "Terima kasih atas pertanyaannya! Sebagai Fintar AI Financial Advisor, saya siap membantu Anda dalam perencanaan keuangan, budgeting, investasi, dan strategi menabung. Silakan tanyakan aspek keuangan khusus yang ingin Anda diskusikan.";
}

function generateFallbackSuggestions(message: string): string[] {
  const suggestions = [
    "Bagaimana cara membuat budget bulanan?",
    "Investasi apa yang cocok untuk pemula?",
    "Tips menabung untuk dana darurat",
    "Strategi melunasi hutang dengan cepat",
    "Cara memilih asuransi yang tepat",
    "Perencanaan keuangan untuk masa pensiun",
    "Analisis risiko investasi",
    "Tips mengelola cash flow bisnis",
  ];

  return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
}

async function getCapabilities() {
  try {
    const response = await fetch(`${BACKEND_URL}/ai/capabilities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to get capabilities:", error);
  }

  // Fallback capabilities
  return {
    features: [
      "financial_analysis",
      "budget_planning",
      "investment_advice",
      "savings_strategy",
      "debt_management",
      "risk_assessment",
    ],
    models: ["gemini-2.0-flash"],
    languages: ["id", "en"],
    maxTokens: 8192,
    supportedFormats: ["text"],
  };
}
