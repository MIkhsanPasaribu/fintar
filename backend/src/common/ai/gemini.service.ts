import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface FinancialContext {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  currentSavings?: number;
  financialGoals?: string[];
  riskTolerance?: string;
  age?: number;
  occupation?: string;
  dependents?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  tokens: number;
  processingTime: number;
  confidence: number;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isAvailable = false;
  private lastRequestTime = 0;
  private requestCount = 0;
  private readonly MIN_DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds
  private readonly MAX_REQUESTS_PER_MINUTE = 15; // Conservative limit
  private requestTimes: number[] = [];

  constructor(private configService: ConfigService) {
    this.initializeGemini();
  }

  private initializeGemini() {
    try {
      const apiKey = this.configService.get<string>("GEMINI_API_KEY");

      if (!apiKey) {
        this.logger.warn(
          "⚠️ Gemini API key not configured, AI services disabled"
        );
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
      this.isAvailable = true;
      this.logger.log("✅ Gemini AI client initialized");
    } catch (error) {
      this.logger.error("❌ Failed to initialize Gemini AI client:", error);
    }
  }

  isGeminiAvailable(): boolean {
    return this.isAvailable;
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();

    // Remove requests older than 1 minute
    this.requestTimes = this.requestTimes.filter((time) => now - time < 60000);

    // Check if we've exceeded requests per minute
    if (this.requestTimes.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = 60000 - (now - oldestRequest);
      if (waitTime > 0) {
        this.logger.warn(`⏱️ Rate limit reached, waiting ${waitTime}ms`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    // Ensure minimum delay between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_DELAY_BETWEEN_REQUESTS) {
      const delay = this.MIN_DELAY_BETWEEN_REQUESTS - timeSinceLastRequest;
      this.logger.debug(`⏸️ Enforcing delay of ${delay}ms between requests`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.requestTimes.push(Date.now());
    this.lastRequestTime = Date.now();
  }

  private async callGeminiWithRetry(
    prompt: string,
    maxRetries = 2
  ): Promise<any> {
    await this.enforceRateLimit();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.debug(
          `🤖 Calling Gemini API (attempt ${attempt}/${maxRetries})`
        );
        const result = await this.model.generateContent(prompt);
        return result;
      } catch (error: any) {
        const isQuotaError =
          error.message?.includes("429") || error.message?.includes("quota");
        const isRateLimit = error.message?.includes("Too Many Requests");

        if (isQuotaError || isRateLimit) {
          this.logger.warn(
            `⚠️ Quota/Rate limit error on attempt ${attempt}: ${error.message}`
          );

          if (attempt < maxRetries) {
            // Extract retry delay from error if available
            const retryMatch = error.message.match(/retryDelay":"(\d+)s/);
            const retryDelay = retryMatch
              ? parseInt(retryMatch[1]) * 1000
              : 5000;

            this.logger.log(`⏳ Waiting ${retryDelay}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          } else {
            throw new Error(
              `API quota exceeded. Please wait before making more requests. Error: ${error.message}`
            );
          }
        } else {
          // For non-quota errors, throw immediately
          throw error;
        }
      }
    }
  }

  async generateFinancialAdvice(
    context: FinancialContext,
    question?: string
  ): Promise<AIResponse> {
    if (!this.isAvailable) {
      throw new Error("Gemini AI is not available");
    }

    const startTime = Date.now();

    const prompt = this.buildFinancialAdvisorPrompt(context, question);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      this.logger.log(`Generated financial advice in ${processingTime}ms`);

      return {
        content: text,
        model: "gemini-2.0-flash",
        tokens: this.estimateTokens(prompt + text),
        processingTime,
        confidence: 0.85, // Default confidence for financial advice
      };
    } catch (error) {
      this.logger.error("Failed to generate financial advice:", error);
      throw new Error(
        `AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async analyzeBudget(context: FinancialContext): Promise<AIResponse> {
    if (!this.isAvailable) {
      throw new Error("Gemini AI is not available");
    }

    const startTime = Date.now();

    const prompt = this.buildBudgetAnalysisPrompt(context);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      return {
        content: text,
        model: "gemini-2.0-flash",
        tokens: this.estimateTokens(prompt + text),
        processingTime,
        confidence: 0.9, // High confidence for budget analysis
      };
    } catch (error) {
      this.logger.error("Failed to analyze budget:", error);
      throw new Error(
        `Budget analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async createInvestmentStrategy(
    context: FinancialContext
  ): Promise<AIResponse> {
    if (!this.isAvailable) {
      throw new Error("Gemini AI is not available");
    }

    const startTime = Date.now();

    const prompt = this.buildInvestmentStrategyPrompt(context);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      return {
        content: text,
        model: "gemini-2.0-flash",
        tokens: this.estimateTokens(prompt + text),
        processingTime,
        confidence: 0.8, // Moderate confidence for investment strategy
      };
    } catch (error) {
      this.logger.error("Failed to create investment strategy:", error);
      throw new Error(
        `Investment strategy creation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async processChatMessage(
    message: string,
    context?: FinancialContext
  ): Promise<AIResponse> {
    if (!this.isAvailable) {
      throw new Error("Gemini AI is not available");
    }

    const startTime = Date.now();

    const prompt = this.buildChatPrompt(message, context);

    try {
      const result = await this.callGeminiWithRetry(prompt);
      const response = await result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      this.logger.log(
        `✅ Chat message processed successfully in ${processingTime}ms`
      );

      return {
        content: text,
        model: "gemini-2.0-flash",
        tokens: this.estimateTokens(prompt + text),
        processingTime,
        confidence: 0.85,
      };
    } catch (error) {
      this.logger.error("Failed to process chat message:", error);
      throw new Error(
        `Chat processing failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private buildFinancialAdvisorPrompt(
    context: FinancialContext,
    question?: string
  ): string {
    const basePrompt = `Bertindaklah sebagai penasihat keuangan pribadi untuk pengguna berusia 20–35 tahun di Indonesia dengan penghasilan terbatas. Tugasmu adalah membantu mereka membuat rencana tabungan, meminimalisir pengeluaran tidak perlu, dan memberikan motivasi finansial berbasis psikologi keuangan modern. Gunakan kemampuan analisis Google Gemini untuk memberikan insight yang mendalam dan relevan dengan konteks ekonomi Indonesia.

Data Pengguna:
- Penghasilan bulanan: ${context.monthlyIncome ? `Rp ${context.monthlyIncome.toLocaleString("id-ID")}` : "Tidak diketahui"}
- Pengeluaran bulanan: ${context.monthlyExpenses ? `Rp ${context.monthlyExpenses.toLocaleString("id-ID")}` : "Tidak diketahui"}
- Tabungan saat ini: ${context.currentSavings ? `Rp ${context.currentSavings.toLocaleString("id-ID")}` : "Tidak diketahui"}
- Tujuan finansial: ${context.financialGoals?.join(", ") || "Tidak ditentukan"}
- Toleransi risiko: ${context.riskTolerance || "Tidak ditentukan"}
- Pekerjaan: ${context.occupation || "Tidak diketahui"}
- Tanggungan: ${context.dependents || 0} orang

${question ? `Pertanyaan spesifik: ${question}` : "Berikan saran finansial umum berdasarkan profil di atas."}

Berikan saran yang praktis, realistis, dan dapat diterapkan dalam konteks ekonomi Indonesia. Gunakan bahasa yang mudah dipahami dan berikan contoh konkret.`;

    return basePrompt;
  }

  private buildBudgetAnalysisPrompt(context: FinancialContext): string {
    return `Sebagai analis keuangan expert, lakukan analisis mendalam terhadap anggaran berikut:

Data Keuangan:
- Penghasilan bulanan: Rp ${context.monthlyIncome?.toLocaleString("id-ID") || "0"}
- Pengeluaran bulanan: Rp ${context.monthlyExpenses?.toLocaleString("id-ID") || "0"}
- Tabungan saat ini: Rp ${context.currentSavings?.toLocaleString("id-ID") || "0"}
- Tanggungan: ${context.dependents || 0} orang

Analisis yang diperlukan:
1. Rasio pengeluaran terhadap pendapatan
2. Potensi penghematan dan optimalisasi
3. Rekomendasi alokasi dana (50/30/20 rule atau yang lebih sesuai)
4. Identifikasi area pengeluaran yang bisa dipangkas
5. Strategi meningkatkan tabungan bulanan
6. Peringatan jika ada red flags dalam pola keuangan

Berikan analisis dalam format yang terstruktur dan mudah dipahami dengan rekomendasi actionable.`;
  }

  private buildInvestmentStrategyPrompt(context: FinancialContext): string {
    return `Sebagai konsultan investasi berpengalaman, buatkan strategi investasi personal berdasarkan profil berikut:

Profil Investor:
- Penghasilan bulanan: Rp ${context.monthlyIncome?.toLocaleString("id-ID") || "0"}
- Tabungan saat ini: Rp ${context.currentSavings?.toLocaleString("id-ID") || "0"}
- Toleransi risiko: ${context.riskTolerance || "Moderate"}
- Tujuan keuangan: ${context.financialGoals?.join(", ") || "Tidak ditentukan"}
- Usia estimasi: ${context.age || "25-35"} tahun
- Pekerjaan: ${context.occupation || "Tidak diketahui"}

Buatkan strategi investasi yang mencakup:
1. Portofolio allocation (saham, obligasi, reksadana, emas, dll)
2. Instrumen investasi yang cocok untuk pemula di Indonesia
3. Platform investasi terpercaya (Bareksa, Bibit, Stockbit, dll)
4. Target return realistis
5. Timeline investasi untuk setiap tujuan
6. Strategi diversifikasi yang sesuai tolerance risiko
7. Tips mengelola emosi saat berinvestasi

Berikan rekomendasi yang spesifik untuk konteks pasar Indonesia dan mudah diimplementasikan.`;
  }

  private buildChatPrompt(message: string, context?: FinancialContext): string {
    const contextInfo = context
      ? `

Data pengguna untuk konteks:
- Penghasilan: ${context.monthlyIncome ? `Rp ${context.monthlyIncome.toLocaleString("id-ID")}` : "Tidak diketahui"}
- Pengeluaran: ${context.monthlyExpenses ? `Rp ${context.monthlyExpenses.toLocaleString("id-ID")}` : "Tidak diketahui"}
- Tabungan: ${context.currentSavings ? `Rp ${context.currentSavings.toLocaleString("id-ID")}` : "Tidak diketahui"}
- Tujuan: ${context.financialGoals?.join(", ") || "Tidak ditentukan"}`
      : "";

    return `Kamu adalah Fintar AI, asisten keuangan pribadi yang ahli dalam memberikan saran finansial untuk masyarakat Indonesia. Kamu memiliki pengetahuan mendalam tentang:
- Produk keuangan Indonesia (bank, fintech, investasi)
- Ekonomi dan inflasi Indonesia
- Psikologi keuangan
- Strategi budgeting dan saving
- Investasi untuk pemula hingga advanced

Prinsip komunikasi:
- Ramah, supportive, dan tidak menggurui
- Berikan saran yang praktis dan actionable
- Gunakan contoh konkret dalam Rupiah
- Hindari jargon yang rumit
- Selalu pertimbangkan kondisi ekonomi Indonesia

${contextInfo}

Pertanyaan/Permintaan: ${message}

Berikan respons yang helpful, accurate, dan sesuai dengan konteks keuangan pengguna.`;
  }

  async generateInvestmentAdvice(prompt: string): Promise<AIResponse> {
    if (!this.isAvailable) {
      throw new Error("Gemini AI is not available");
    }

    const startTime = Date.now();

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      return {
        content: text,
        model: "gemini-2.0-flash",
        tokens: this.estimateTokens(prompt + text),
        processingTime,
        confidence: 0.8,
      };
    } catch (error) {
      this.logger.error("Failed to generate investment advice:", error);
      throw new Error(
        `Investment advice generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async generateComprehensiveFinancialPlan(
    prompt: string
  ): Promise<AIResponse> {
    if (!this.isAvailable) {
      throw new Error("Gemini AI is not available");
    }

    const startTime = Date.now();

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      return {
        content: text,
        model: "gemini-2.0-flash",
        tokens: this.estimateTokens(prompt + text),
        processingTime,
        confidence: 0.85,
      };
    } catch (error) {
      this.logger.error("Failed to generate financial plan:", error);
      throw new Error(
        `Financial plan generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async generateFinancialInsights(prompt: string): Promise<AIResponse> {
    if (!this.isAvailable) {
      throw new Error("Gemini AI is not available");
    }

    const startTime = Date.now();

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const processingTime = Date.now() - startTime;

      return {
        content: text,
        model: "gemini-2.0-flash",
        tokens: this.estimateTokens(prompt + text),
        processingTime,
        confidence: 0.85,
      };
    } catch (error) {
      this.logger.error("Failed to generate financial insights:", error);
      throw new Error(
        `Financial insights generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 0.75 words for Indonesian
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 0.75);
  }
}
