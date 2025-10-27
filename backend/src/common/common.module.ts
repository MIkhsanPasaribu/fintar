import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { MongodbService } from "./mongodb/mongodb.service";
import { SupabaseService } from "./supabase/supabase.service";
import { GeminiService } from "./ai/gemini.service";
import { PerformanceMetricsService } from "./analytics/performance-metrics.service";

@Global()
@Module({
  providers: [
    PrismaService,
    MongodbService,
    SupabaseService,
    GeminiService,
    PerformanceMetricsService,
  ],
  exports: [
    PrismaService,
    MongodbService,
    SupabaseService,
    GeminiService,
    PerformanceMetricsService,
  ],
})
export class CommonModule {}
