import { NestFactory } from '@nestjs/core';
import { FinappModule } from './finapp.module';

async function bootstrap() {
  const app = await NestFactory.create(FinappModule);
  await app.listen(3000);
}
bootstrap();
