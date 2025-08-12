import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { AiChatService } from "./ai-chat.service";
import { CommonModule } from "../common/common.module";
import { AnalyticsService } from "../common/analytics/analytics.service";

@Module({
  imports: [CommonModule],
  controllers: [ChatController],
  providers: [ChatService, AiChatService, AnalyticsService],
  exports: [ChatService, AiChatService, AnalyticsService],
})
export class ChatModule {}
