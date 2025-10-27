import { Module } from "@nestjs/common";
import { AnalyticsController } from "./analytics.controller";
import { PerformanceMetricsService } from "./performance-metrics.service";
import { CommonModule } from "../common.module";

@Module({
  imports: [CommonModule],
  controllers: [AnalyticsController],
  providers: [PerformanceMetricsService],
  exports: [PerformanceMetricsService],
})
export class AnalyticsModule {}
