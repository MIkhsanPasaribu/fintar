import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsObject } from "class-validator";

export class ChatMessageDto {
  @ApiProperty({
    example: "Bagaimana cara mengatur budget bulanan yang efektif?",
    description: "Content of the chat message",
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: {
      userContext: "financial_planning",
      priority: "high",
    },
    description: "Additional context for the message",
    required: false,
  })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class AiResponseDto {
  @ApiProperty({
    example: "Untuk mengatur budget bulanan yang efektif, saya sarankan...",
    description: "AI response content",
  })
  content: string;

  @ApiProperty({
    example: {
      model: "gemini-2.0-flash",
      tokens: 150,
      processingTime: 1200,
      confidence: 0.95,
    },
    description: "AI metadata",
  })
  aiMetadata: {
    model: string;
    tokens: number;
    processingTime: number;
    confidence: number;
  };

  @ApiProperty({
    example: "2024-01-15T10:30:00Z",
    description: "Response timestamp",
  })
  timestamp: Date;
}
