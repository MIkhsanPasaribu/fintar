import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { FinancialModule } from './financial/financial.module';
import { ConsultantsModule } from './consultants/consultants.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { MongoModule } from './common/mongo/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    MongoModule,
    AuthModule,
    UsersModule,
    ChatModule,
    FinancialModule,
    ConsultantsModule,
  ],
})
export class AppModule {}
