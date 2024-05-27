import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  
  const configService = app.get(ConfigService);
  const appPort = configService.get('APP_PORT') || 3000;
  
  await app.listen(appPort);
}
bootstrap();
