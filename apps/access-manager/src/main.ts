import { NestFactory } from '@nestjs/core';
import { AccessManagerModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AccessManagerModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      name: 'access-service',
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      username: configService.get<string>('REDIS_USER'),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
  });

  const port = configService.get<number>('ACCESS_MANAGER_PORT');
  const globalPrefix = 'v1';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(
    `🚀 Access manager service is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
