import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { RequestTokenDto } from './dto/request-token.dto';
import { RedisPubSubService } from '../common/redis-pubsub.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TokensService {
  private client: ClientProxy;

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly redisPubSubService: RedisPubSubService,
  ) {
    this.client = this.redisPubSubService.getClient();
  }

  async requestToken(requestTokenDto: RequestTokenDto): Promise<Token> {
    const keyDetails = await this.validateKey(requestTokenDto.key);

    if (keyDetails.disabled) {
      throw new BadRequestException('Key is disabled');
    }

    return this.findTokenByUserId(keyDetails.userId);
  }

  async validateKey(key: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'validate_key' }, { key }),
      );

      if (!response) {
        throw new BadRequestException('Invalid key');
      }
      return response;
    } catch (error) {
      throw new BadRequestException('Invalid or expired key');
    }
  }

  async findTokenByUserId(userId: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ userId }).exec();
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    return token;
  }
}
