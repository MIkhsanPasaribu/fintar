import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import compression from "compression";
import { AppModule } from "./app.module";

let app: any;

async function createNestApp() {
  const nestApp = await NestFactory.create(AppModule);

  // Get config service
  const configService = nestApp.get(ConfigService);

  // Security middlewares
  nestApp.use(helmet());
  nestApp.use(compression());

  // CORS configuration
  nestApp.enableCors({
    origin: [
      "http://localhost:3000", // Frontend development
      "https://fintar.vercel.app", // Production frontend
      configService.get("FRONTEND_URL"), // Custom frontend URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // Global validation pipe
  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // API prefix
  nestApp.setGlobalPrefix("api/v1");

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Fintar API")
    .setDescription("AI-Powered Financial Management Platform API")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management endpoints")
    .addTag("chat", "AI Chat endpoints")
    .addTag("financial", "Financial planning endpoints")
    .addTag("consultants", "Consultant marketplace endpoints")
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup("api/docs", nestApp, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await nestApp.init();
  return nestApp;
}

async function bootstrap() {
  const app = await createNestApp();

  // Start server for local development
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get("PORT")) || 3001;
  await app.listen(port, "0.0.0.0");

  console.log(`🚀 Fintar Backend API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔗 Health Check: http://localhost:${port}/api/v1/health`);
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createNestApp();
  }
  return app.getHttpAdapter().getInstance()(req, res);
}

// Start server for local development only if not in serverless environment
if (typeof window === "undefined" && !process.env.VERCEL) {
  bootstrap().catch((error) => {
    console.error("Failed to start application:", error);
  });
}
