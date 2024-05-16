import { NestFactory } from '@nestjs/core';
import { AccessManagerModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AccessManagerModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      // username: process.env.REDIS_USER,
      // password: process.env.REDIS_PASSWORD,
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('ACCESS_MANAGER_PORT');
  const globalPrefix = 'v1';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(
    `🚀 Deployment service is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
