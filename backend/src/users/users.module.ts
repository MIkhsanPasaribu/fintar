import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaModule } from "../common/prisma/prisma.module";
import { SupabaseModule } from "../common/supabase/supabase.module";

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
