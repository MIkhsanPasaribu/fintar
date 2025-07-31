import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { GeminiService } from "../common/ai/gemini.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { ChatMessageDto } from "./dto/chat-message.dto";

@Injectable()
export class AiChatService {
  private readonly logger = new Logger(AiChatService.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly geminiService: GeminiService,
    private readonly prismaService: PrismaService
  ) {}

  async processMessage(
    userId: string,
    sessionId: string,
    messageDto: ChatMessageDto
  ) {
    const startTime = Date.now();

    try {
      // Get session to verify ownership and get context
      const session = await this.chatService.getSession(sessionId, userId);

      // Get user profile and financial data for context
      const userContext = await this.getUserContext(userId);

      // Save user message
      const userMessage = await this.chatService.addMessage(sessionId, userId, {
        role: "USER",
        content: messageDto.content,
      });

      // Generate AI response based on session type and user context
      const aiResponse = await this.generateAIResponse(
        messageDto.content,
        session.type,
        userContext,
        session.metadata
      );

      // Save AI response
      const aiMessage = await this.chatService.addMessage(sessionId, userId, {
        role: "ASSISTANT",
        content: aiResponse.content,
        metadata: aiResponse.metadata,
      });

      // Log analytics
      const processingTime = Date.now() - startTime;
      await this.chatService.logAIAnalytics({
        userId,
        sessionId,
        type: "chat_interaction",
        action: "ai_response_generated",
        data: {
          aiModel: "gemini-2.0-flash",
          requestData: { message: messageDto.content, type: session.type },
          responseData: { response: aiResponse.content },
          processingTime,
          tokenUsage: aiResponse.metadata?.tokens,
          success: true,
        },
      });

      return {
        userMessage,
        aiMessage,
        sessionInfo: {
          id: sessionId,
          type: session.type,
          title: session.title,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to process message for user ${userId}:`, error);

      // Log failed analytics
      const processingTime = Date.now() - startTime;
      await this.chatService.logAIAnalytics({
        userId,
        sessionId,
        type: "chat_interaction",
        action: "ai_response_failed",
        data: {
          aiModel: "gemini-2.0-flash",
          requestData: { message: messageDto.content },
          responseData: null,
          processingTime,
          tokenUsage: 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });

      throw new BadRequestException("Failed to process message");
    }
  }

  private async getUserContext(userId: string) {
    try {
      // Get user basic info
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          onboardingCompleted: true,
          profileCompleted: true,
          financialDataCompleted: true,
        },
      });

      // Get user profile
      const profile = await this.prismaService.userProfile.findUnique({
        where: { userId },
      });

      // Get financial data
      const financialData = await this.prismaService.financialData.findFirst({
        where: { userId },
      });

      return {
        user,
        profile,
        financialData,
      };
    } catch (error) {
      this.logger.warn(`Could not fetch user context for ${userId}:`, error);
      return null;
    }
  }

  private async generateAIResponse(
    message: string,
    sessionType: string,
    userContext: any,
    sessionMetadata: any
  ) {
    // Build context-aware prompt based on session type
    const prompt = this.buildPrompt(
      message,
      sessionType,
      userContext,
      sessionMetadata
    );

    // Generate AI response using Gemini
    const response = await this.geminiService.processChatMessage(prompt);

    return {
      content: response.content,
      metadata: {
        model: response.model,
        tokens: response.tokens,
        processingTime: response.processingTime,
        confidence: response.confidence,
      },
    };
  }

  private buildPrompt(
    message: string,
    sessionType: string,
    userContext: any,
    sessionMetadata: any
  ): string {
    const basePrompt = this.getBasePromptForType(sessionType);

    let contextInfo = "";
    if (userContext) {
      contextInfo = this.buildUserContextString(userContext);
    }

    return `${basePrompt}

${contextInfo}

Pertanyaan pengguna: ${message}

Berikan jawaban yang:
1. Praktis dan dapat diterapkan
2. Sesuai dengan konteks keuangan Indonesia
3. Mudah dipahami untuk usia 20-35 tahun
4. Berdasarkan data profil pengguna (jika tersedia)
5. Memberikan actionable insights

Jawaban:`;
  }

  private getBasePromptForType(sessionType: string): string {
    const prompts = {
      financial_planning: `
Bertindaklah sebagai penasihat keuangan pribadi yang ahli dalam perencanaan keuangan untuk generasi milenial Indonesia.
Fokus pada strategi budgeting, saving plans, dan mencapai tujuan finansial jangka pendek dan panjang.
      `,
      investment_advice: `
Bertindaklah sebagai konsultan investasi yang berpengalaman di pasar modal Indonesia.
Berikan rekomendasi investasi yang sesuai dengan profil risiko pengguna dan kondisi ekonomi Indonesia.
      `,
      budget_help: `
Bertindaklah sebagai coach keuangan yang membantu mengoptimalkan anggaran bulanan.
Fokus pada analisis pengeluaran, identifikasi pemborosan, dan strategi hemat yang realistis.
      `,
      general: `
Bertindaklah sebagai asisten AI keuangan yang ramah dan berpengetahuan luas tentang finansial personal di Indonesia.
Siap membantu berbagai pertanyaan keuangan dengan pendekatan yang personal dan praktis.
      `,
    };

    return prompts[sessionType] || prompts.general;
  }

  private buildUserContextString(userContext: any): string {
    let context = "Konteks Pengguna:\n";

    if (userContext.user) {
      const { firstName, lastName } = userContext.user;
      context += `- Nama: ${firstName} ${lastName}\n`;
    }

    if (userContext.profile) {
      const { occupation, maritalStatus, dependents } = userContext.profile;
      if (occupation) context += `- Pekerjaan: ${occupation}\n`;
      if (maritalStatus) context += `- Status Pernikahan: ${maritalStatus}\n`;
      if (dependents > 0) context += `- Tanggungan: ${dependents} orang\n`;
    }

    if (userContext.financialData) {
      const {
        monthlyIncome,
        monthlyExpenses,
        currentSavings,
        riskTolerance,
        financialGoals,
      } = userContext.financialData;

      if (monthlyIncome)
        context += `- Penghasilan Bulanan: Rp ${monthlyIncome.toLocaleString("id-ID")}\n`;
      if (monthlyExpenses)
        context += `- Pengeluaran Bulanan: Rp ${monthlyExpenses.toLocaleString("id-ID")}\n`;
      if (currentSavings)
        context += `- Total Tabungan: Rp ${currentSavings.toLocaleString("id-ID")}\n`;
      if (riskTolerance) context += `- Toleransi Risiko: ${riskTolerance}\n`;
      if (financialGoals && financialGoals.length > 0) {
        context += `- Tujuan Keuangan: ${financialGoals.join(", ")}\n`;
      }
    }

    return context;
  }
}
