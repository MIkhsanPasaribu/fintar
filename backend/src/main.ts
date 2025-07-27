import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Log environment configuration for debugging
  const logger = new Logger("Bootstrap");
  logger.log("Starting Fintar Backend API...");
  logger.log(`Environment: ${configService.get("NODE_ENV") || "development"}`);
  logger.log(`Database URL configured: ${!!configService.get("DATABASE_URL")}`);
  logger.log(`Supabase URL configured: ${!!configService.get("SUPABASE_URL")}`);
  logger.log(`JWT Secret configured: ${!!configService.get("JWT_SECRET")}`);

  // Security
  app.use(helmet());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
    })
  );

  // CORS
  app.enableCors({
    origin: configService.get("FRONTEND_URL") || "http://localhost:3000",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // API prefix
  app.setGlobalPrefix("api/v1");

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Fintar API")
    .setDescription(
      "Solusi Optimalisasi Finansial Pintar Keluarga dan UMKM Berbasis AI - REST API"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = configService.get("PORT") || 3001;
  await app.listen(port);

  console.log(`🚀 Fintar Backend API running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
