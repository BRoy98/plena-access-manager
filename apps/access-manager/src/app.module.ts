import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { KeysModule } from './keys/keys.module';
import { RedisPubSubService } from './common/redis-pubsub.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AdminModule,
    KeysModule,
  ],
  providers: [RedisPubSubService],
})
export class AccessManagerModule {}
