import { Module } from "@nestjs/common";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";
import { SUSController } from "./sus.controller";
import { SUSService } from "./sus.service";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [CommonModule],
  controllers: [FeedbackController, SUSController],
  providers: [FeedbackService, SUSService],
  exports: [FeedbackService, SUSService],
})
export class FeedbackModule {}
