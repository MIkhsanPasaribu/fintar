import { Module } from "@nestjs/common";
import { BaselineController } from "./baseline.controller";
import { RuleBasedAdvisorService } from "./rule-based-advisor.service";

@Module({
  controllers: [BaselineController],
  providers: [RuleBasedAdvisorService],
  exports: [RuleBasedAdvisorService],
})
export class BaselineModule {}
