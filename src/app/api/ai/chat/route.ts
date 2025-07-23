import { NextRequest, NextResponse } from "next/server";

// Mock AI responses for demonstration
const mockResponses = [
  "Berdasarkan analisis keuangan Anda, saya sarankan untuk mengalokasikan 20% pendapatan untuk tabungan emergency fund terlebih dahulu.",
  "Untuk investasi yang cocok bagi pemula, Anda bisa mempertimbangkan reksa dana campuran dengan risiko sedang.",
  "Tips mengelola budget: gunakan metode 50/30/20 - 50% kebutuhan, 30% keinginan, 20% tabungan dan investasi.",
  "Dana darurat sebaiknya setara dengan 6-12 bulan pengeluaran rutin Anda. Simpan di tabungan atau deposito yang mudah dicairkan.",
  "Untuk mengurangi pengeluaran tidak perlu, coba buat daftar prioritas dan terapkan 'waiting period' 24 jam sebelum membeli barang non-esensial.",
];

const suggestions = [
  "Bagaimana cara membuat budget bulanan?",
  "Investasi apa yang cocok untuk pemula?",
  "Tips menabung untuk dana darurat",
  "Strategi melunasi hutang dengan cepat",
  "Cara memilih asuransi yang tepat",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Generate mock response based on keywords
    let response =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("budget") || lowerMessage.includes("anggaran")) {
      response =
        "Untuk membuat budget yang efektif, mulai dengan mencatat semua pemasukan dan pengeluaran selama sebulan. Gunakan aplikasi atau spreadsheet untuk tracking. Terapkan prinsip 50/30/20: 50% untuk kebutuhan pokok, 30% untuk keinginan, dan 20% untuk tabungan serta investasi.";
    } else if (
      lowerMessage.includes("investasi") ||
      lowerMessage.includes("invest")
    ) {
      response =
        "Untuk pemula, saya rekomendasikan memulai dengan reksa dana. Pilih reksa dana campuran atau saham dengan track record minimal 3 tahun. Mulai dengan nominal kecil, misalnya Rp 100.000/bulan, dan tingkatkan secara bertahap. Jangan lupa untuk diversifikasi portofolio Anda.";
    } else if (
      lowerMessage.includes("tabung") ||
      lowerMessage.includes("menabung")
    ) {
      response =
        "Strategi menabung yang efektif: 1) Set target yang spesifik dan realistis, 2) Buat automatic transfer ke rekening tabungan, 3) Pisahkan rekening tabungan dari rekening harian, 4) Cari suku bunga terbaik, 5) Review progress secara berkala.";
    } else if (
      lowerMessage.includes("hutang") ||
      lowerMessage.includes("debt")
    ) {
      response =
        "Untuk melunasi hutang, gunakan metode 'debt snowball' atau 'debt avalanche'. Snowball: bayar hutang terkecil dulu untuk motivasi. Avalanche: bayar hutang dengan bunga tertinggi dulu untuk efisiensi. Hindari hutang baru dan pertimbangkan sumber pendapatan tambahan.";
    }

    // Generate random suggestions for follow-up
    const randomSuggestions = suggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return NextResponse.json({
      message: response,
      suggestions: randomSuggestions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AI Chat API is running",
    suggestions: suggestions.slice(0, 3),
  });
}
