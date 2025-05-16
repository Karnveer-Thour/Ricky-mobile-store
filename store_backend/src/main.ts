import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { setupSwaggerConfig } from 'Core/Swagger/Swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  setupSwaggerConfig('/api-docs/v1',app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
