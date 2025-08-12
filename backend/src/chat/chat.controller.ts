import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ChatService } from "./chat.service";
import { AiChatService } from "./ai-chat.service";
import { ChatMessageDto } from "./dto/chat-message.dto";
import { CreateChatSessionDto } from "./dto/chat-session.dto";

@ApiTags("chat")
@Controller("chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly aiChatService: AiChatService
  ) {}

  @Get("sessions")
  @ApiOperation({ summary: "Get user chat sessions" })
  @ApiResponse({ status: 200, description: "List of chat sessions" })
  async getChatSessions(@Request() req, @Query("limit") limit?: number) {
    return this.chatService.getSessions(req.user.id);
  }

  @Post("sessions")
  @ApiOperation({ summary: "Create new chat session" })
  @ApiResponse({
    status: 201,
    description: "Chat session created successfully",
  })
  async createChatSession(
    @Request() req,
    @Body() createSessionDto: CreateChatSessionDto
  ) {
    return this.chatService.createSession(req.user.id, createSessionDto);
  }

  @Get("sessions/:sessionId")
  @ApiOperation({ summary: "Get specific chat session" })
  @ApiResponse({ status: 200, description: "Chat session details" })
  async getChatSession(@Request() req, @Param("sessionId") sessionId: string) {
    return this.chatService.getSession(req.user.id, sessionId);
  }

  @Get("sessions/:sessionId/messages")
  @ApiOperation({ summary: "Get chat messages from session" })
  @ApiResponse({ status: 200, description: "List of chat messages" })
  async getChatMessages(
    @Request() req,
    @Param("sessionId") sessionId: string,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number
  ) {
    return this.chatService.getMessages(sessionId, req.user.id);
  }

  @Post("sessions/:sessionId/messages")
  @ApiOperation({ summary: "Send message to AI chat" })
  @ApiResponse({
    status: 201,
    description: "Message sent and AI response received",
  })
  async sendMessage(
    @Request() req,
    @Param("sessionId") sessionId: string,
    @Body() messageDto: ChatMessageDto
  ) {
    return this.aiChatService.processMessage(
      req.user.id,
      sessionId,
      messageDto
    );
  }

  @Delete("sessions/:sessionId")
  @ApiOperation({ summary: "Delete chat session" })
  @ApiResponse({
    status: 200,
    description: "Chat session deleted successfully",
  })
  async deleteChatSession(
    @Request() req,
    @Param("sessionId") sessionId: string
  ) {
    return this.chatService.deleteSession(req.user.id, sessionId);
  }

  @Get("history/analytics")
  @ApiOperation({ summary: "Get chat analytics for user" })
  @ApiResponse({ status: 200, description: "Chat usage analytics" })
  async getChatAnalytics(@Request() req) {
    return this.chatService.getUserAnalytics(req.user.id);
  }
}
