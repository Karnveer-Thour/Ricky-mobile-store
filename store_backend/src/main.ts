import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { databaseConnect } from './Database/typeORM';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  await databaseConnect();
  console.log("App is listening at port:", process.env.PORT ?? 3000)
}
bootstrap();