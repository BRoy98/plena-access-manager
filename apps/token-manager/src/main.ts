import { NestFactory } from '@nestjs/core';
import { TokenManagerModule } from './token-manager.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TokenManagerModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('TOKEN_MANAGER_PORT');
  const globalPrefix = 'v1';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(port);

  Logger.log(
    `🚀 Deployment service is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
