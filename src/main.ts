import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe({}));

  await app.listen(3000);
}
bootstrap();
