import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { LangChainService } from "./services/langchain.service";
import { LangSmithService } from "./services/langsmith.service";
import { LangGraphSimpleService } from "./services/langgraph-simple.service";
import { FinancialAiAgentService } from "./agents/financial-ai-agent.service";
import { ChatAgentService } from "./agents/chat-agent.service";
import { ConsultantAgentService } from "./agents/consultant-agent.service";

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [
    AiService,
    LangChainService,
    LangSmithService,
    LangGraphSimpleService,
    FinancialAiAgentService,
    ChatAgentService,
    ConsultantAgentService,
  ],
  exports: [
    AiService,
    LangChainService,
    LangSmithService,
    LangGraphSimpleService,
    FinancialAiAgentService,
    ChatAgentService,
    ConsultantAgentService,
  ],
})
export class AiModule {}
