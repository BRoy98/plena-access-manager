import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RedisPubSubService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        // username: process.env.REDIS_USER,
        // password: process.env.REDIS_PASSWORD,
      },
    });
  }

  getClient(): ClientProxy {
    return this.client;
  }
}
