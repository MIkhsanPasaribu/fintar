import { ConfigService } from "@nestjs/config";

export interface AiConfig {
  gemini: {
    apiKey: string;
    model: string;
    temperature: number;
    maxOutputTokens: number;
    topP: number;
    topK: number;
  };
  langsmith: {
    apiKey: string;
    projectName: string;
    tracingEnabled: boolean;
  };
  langchain: {
    verbose: boolean;
    callbacksBackground: boolean;
  };
}

export const createAiConfig = (configService: ConfigService): AiConfig => ({
  gemini: {
    apiKey: configService.get("GOOGLE_API_KEY", ""),
    model: configService.get("GEMINI_MODEL", "gemini-1.5-pro"),
    temperature: parseFloat(configService.get("GEMINI_TEMPERATURE", "0.7")),
    maxOutputTokens: parseInt(
      configService.get("GEMINI_MAX_OUTPUT_TOKENS", "8192")
    ),
    topP: parseFloat(configService.get("GEMINI_TOP_P", "0.95")),
    topK: parseInt(configService.get("GEMINI_TOP_K", "40")),
  },
  langsmith: {
    apiKey: configService.get("LANGSMITH_API_KEY", ""),
    projectName: configService.get("LANGSMITH_PROJECT", "fintar-ai"),
    tracingEnabled: configService.get("LANGSMITH_TRACING", "true") === "true",
  },
  langchain: {
    verbose: configService.get("LANGCHAIN_VERBOSE", "false") === "true",
    callbacksBackground:
      configService.get("LANGCHAIN_CALLBACKS_BACKGROUND", "true") === "true",
  },
});

export const AI_CONFIG = "AI_CONFIG";
