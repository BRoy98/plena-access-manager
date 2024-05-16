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

  async validateKey(key: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'validate_key' }, { key }),
      );
      return response;
    } catch (error) {
      throw new BadRequestException('Invalid or expired key');
    }
  }

  async findTokenByKey(key: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ key }).exec();
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    return token;
  }

  async requestToken(requestTokenDto: RequestTokenDto): Promise<Token> {
    const keyDetails = await this.validateKey(requestTokenDto.key);

    if (keyDetails.disabled) {
      throw new BadRequestException('Key is disabled');
    }

    // Here you can add rate limit checking logic if necessary

    return this.findTokenByKey(requestTokenDto.key);
  }
}
