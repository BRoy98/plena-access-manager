import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { Token, TokenSchema } from './schemas/token.schema';
import { RedisPubSubService } from '../common/redis-pubsub.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [TokensController],
  providers: [TokensService, RedisPubSubService],
})
export class TokensModule {}
