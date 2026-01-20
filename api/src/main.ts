import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Habilita CORS (se o frontend estiver em um domínio diferente)
  app.enableCors();

  await app.listen(process.env.PORT || 3001);
  console.log(
    `HTTP Server is running on: http://localhost:${process.env.PORT || '3001'}/api`,
  );
}
bootstrap();
