import { NestFactory } from '@nestjs/core';
import { AccessManagerModule } from './access-manager.module';

async function bootstrap() {
  const app = await NestFactory.create(AccessManagerModule);
  await app.listen(3000);
}
bootstrap();
