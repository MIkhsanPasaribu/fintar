import { Module } from "@nestjs/common";
import { FinancialController } from "./financial.controller";
import { FinancialService } from "./financial.service";
import { BudgetService } from "./budget.service";
import { InvestmentService } from "./investment.service";
import { AIFinancialService } from "./ai-financial.service";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [CommonModule],
  controllers: [FinancialController],
  providers: [
    FinancialService,
    BudgetService,
    InvestmentService,
    AIFinancialService,
  ],
  exports: [
    FinancialService,
    BudgetService,
    InvestmentService,
    AIFinancialService,
  ],
})
export class FinancialModule {}
