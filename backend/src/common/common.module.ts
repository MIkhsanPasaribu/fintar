import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { MongodbService } from "./mongodb/mongodb.service";
import { SupabaseService } from "./supabase/supabase.service";
import { GeminiService } from "./ai/gemini.service";

@Global()
@Module({
  providers: [PrismaService, MongodbService, SupabaseService, GeminiService],
  exports: [PrismaService, MongodbService, SupabaseService, GeminiService],
})
export class CommonModule {}
