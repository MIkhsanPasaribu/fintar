import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

export enum ChatType {
  FINANCIAL_PLANNING = "financial_planning",
  INVESTMENT_ADVICE = "investment_advice",
  BUDGET_HELP = "budget_help",
  GENERAL = "general",
}

export class CreateChatSessionDto {
  @ApiProperty({
    example: "Perencanaan Keuangan Bulanan",
    description: "Title of the chat session",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    enum: ChatType,
    example: ChatType.FINANCIAL_PLANNING,
    description: "Type of chat session",
  })
  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @ApiProperty({
    example: { context: "user_profile", goal: "saving_plan" },
    description: "Additional metadata for the session",
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
