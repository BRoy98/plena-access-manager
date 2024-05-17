import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeysModule } from './keys/keys.module';
import { RedisPubSubService } from './common/redis-pubsub.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        retryAttempts: 10,
      }),
    }),
    AdminModule,
    KeysModule,
  ],
  providers: [RedisPubSubService],
})
export class AccessManagerModule {}
