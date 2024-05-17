import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RedisPubSubService {
  private client: ClientProxy;

  constructor(
    @Inject(ConfigService)
    private config: ConfigService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
      },
    });
  }

  getClient(): ClientProxy {
    return this.client;
  }
}
