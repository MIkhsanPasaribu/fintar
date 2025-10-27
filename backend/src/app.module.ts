import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ChatModule } from "./chat/chat.module";
import { FinancialModule } from "./financial/financial.module";
import { ConsultantsModule } from "./consultants/consultants.module";
import { CommonModule } from "./common/common.module";
import { HealthModule } from "./health/health.module";
import { EvaluationModule } from "./evaluation/evaluation.module";
import { AnalyticsModule } from "./common/analytics/analytics.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { BaselineModule } from "./baseline/baseline.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    CommonModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ChatModule,
    FinancialModule,
    ConsultantsModule,
    EvaluationModule,
    AnalyticsModule,
    FeedbackModule,
    BaselineModule,
  ],
})
export class AppModule {}
