import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { createAiConfig, AiConfig } from "../config/ai.config";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  context?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);
  private readonly config: AiConfig;
  private readonly llm: ChatGoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.config = createAiConfig(configService);

    // Initialize Google Gemini LLM with error handling
    try {
      this.llm = new ChatGoogleGenerativeAI({
        apiKey: this.config.gemini.apiKey,
        model: this.config.gemini.model,
        temperature: this.config.gemini.temperature,
        maxOutputTokens: this.config.gemini.maxOutputTokens,
        topP: this.config.gemini.topP,
        topK: this.config.gemini.topK,
        verbose: this.config.langchain.verbose,
      });

      // Set background callbacks based on configuration
      if (!this.config.langchain.callbacksBackground) {
        process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "false";
      }

      this.logger.log(
        "LangChain service initialized successfully with Google Gemini"
      );
    } catch (error) {
      this.logger.error("Failed to initialize LangChain service:", error);
      throw error;
    }
  }

  /**
   * Create a simple chat completion
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const langchainMessages = this.convertMessagesToLangChain(messages);
      const response = await this.llm.invoke(langchainMessages);
      return response.content as string;
    } catch (error) {
      this.logger.error("Error in chat completion:", error);
      throw new Error(
        `Chat completion failed: ${(error as Error).message || "Unknown error"}`
      );
    }
  }

  /**
   * Create a financial advisor chat with custom prompt using Google Gemini
   */
  async financialAdvisorChat(
    userMessage: string,
    context?: Record<string, any>
  ): Promise<string> {
    try {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `Bertindaklah sebagai penasihat keuangan pribadi untuk pengguna berusia 20–35 tahun di Indonesia dengan penghasilan terbatas. 
        Tugasmu adalah membantu mereka membuat rencana tabungan, meminimalisir pengeluaran tidak perlu, dan memberikan motivasi finansial berbasis psikologi keuangan modern. 
        Gunakan kemampuan analisis Google Gemini untuk memberikan insight yang mendalam dan relevan dengan konteks ekonomi Indonesia.
        
        Anda membantu pengguna dengan:
        - Saran investasi dan manajemen portofolio
        - Perencanaan keuangan dan penganggaran
        - Penilaian risiko dan rekomendasi asuransi
        - Strategi optimalisasi pajak
        - Perencanaan pensiun
        - Analisis pasar dan wawasan finansial

        Selalu berikan saran keuangan yang profesional, akurat, dan membantu.
        Jelaskan risiko dengan jelas dan dorong pengguna untuk berkonsultasi dengan profesional berlisensi untuk keputusan besar.
        Gunakan bahasa Indonesia yang mudah dipahami dan berikan contoh yang relevan dengan kondisi ekonomi Indonesia.
        
        Konteks: {context}`,
        ],
        ["human", "{input}"],
      ]);

      const chain = RunnableSequence.from([
        prompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({
        input: userMessage,
        context: JSON.stringify(context || {}),
      });

      return response;
    } catch (error) {
      this.logger.error("Error in financial advisor chat:", error);
      throw new Error(
        `Financial advisor chat failed: ${(error as Error).message || "Unknown error"}`
      );
    }
  }

  /**
   * Create a consultant chat with industry-specific knowledge
   */
  async consultantChat(
    userMessage: string,
    industryType: string,
    context?: Record<string, any>
  ): Promise<string> {
    try {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are a professional business consultant specializing in {industryType}.
        You provide expert advice on:
        - Business strategy and planning
        - Market analysis and competitive positioning
        - Operational efficiency and process improvement
        - Financial performance optimization
        - Risk management and compliance
        - Digital transformation and technology adoption

        Tailor your advice specifically to the {industryType} industry.
        Provide actionable insights and practical recommendations.
        
        Context: {context}`,
        ],
        ["human", "{input}"],
      ]);

      const chain = RunnableSequence.from([
        prompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({
        input: userMessage,
        industryType,
        context: JSON.stringify(context || {}),
      });

      return response;
    } catch (error) {
      this.logger.error("Error in consultant chat:", error);
      throw new Error(
        `Consultant chat failed: ${(error as Error).message || "Unknown error"}`
      );
    }
  }

  /**
   * Analyze financial documents or data
   */
  async analyzeFinancialData(
    data: Record<string, any>,
    analysisType: "portfolio" | "budget" | "forecast" | "risk"
  ): Promise<string> {
    try {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are a financial data analyst. Analyze the provided financial data and generate insights.
        
        Analysis Type: {analysisType}
        
        For portfolio analysis: Focus on asset allocation, performance, risk metrics, and diversification.
        For budget analysis: Focus on income vs expenses, spending patterns, and optimization opportunities.
        For forecast analysis: Focus on trends, projections, and scenario planning.
        For risk analysis: Focus on risk factors, stress testing, and mitigation strategies.
        
        Provide clear, actionable insights with specific recommendations.`,
        ],
        ["human", "Please analyze this financial data: {data}"],
      ]);

      const chain = RunnableSequence.from([
        prompt,
        this.llm,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({
        data: JSON.stringify(data),
        analysisType,
      });

      return response;
    } catch (error) {
      this.logger.error("Error in financial data analysis:", error);
      throw new Error(
        `Financial data analysis failed: ${(error as Error).message || "Unknown error"}`
      );
    }
  }

  /**
   * Convert chat messages to LangChain format
   */
  private convertMessagesToLangChain(messages: ChatMessage[]) {
    return messages.map((msg) => {
      switch (msg.role) {
        case "system":
          return new SystemMessage(msg.content);
        case "user":
          return new HumanMessage(msg.content);
        case "assistant":
          return new AIMessage(msg.content);
        default:
          return new HumanMessage(msg.content);
      }
    });
  }

  /**
   * Get LLM instance for advanced usage
   */
  getLLM(): ChatGoogleGenerativeAI {
    return this.llm;
  }

  /**
   * Get configuration
   */
  getConfig(): AiConfig {
    return this.config;
  }
}
