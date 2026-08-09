import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { setupSwaggerConfig } from 'Core/Swagger/Swagger.config';
import { DEFAULT_PORT } from 'Common/constants';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite customer storefront
      'http://localhost:3001', // Next.js admin portal
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  setupSwaggerConfig('/api-docs/v1', app);
  const port = process.env.PORT ?? DEFAULT_PORT;
  await app.listen(port);
  logger.log(`Nest application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api-docs/v1`);
}
bootstrap();
