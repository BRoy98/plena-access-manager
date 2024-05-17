import {
  Injectable,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { TokensService } from '../tokens/tokens.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    @InjectThrottlerOptions()
    protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage()
    protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
    @Inject(TokensService) private tokensService: TokensService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(context: ExecutionContext): Promise<string> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;

    return apiKey;
  }

  protected generateKey(context: ExecutionContext, suffix: string): string {
    return suffix;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tracker = await this.getTracker(context);
    const keyDetails = await this.tokensService.validateKey(tracker);
    if (
      !keyDetails ||
      keyDetails.disabled ||
      new Date(keyDetails.expiration) < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    const limit = keyDetails.rateLimit;
    const ttl = this.configService.get<number>('THROTTLER_TTL') || 60000;

    const key = this.generateKey(context, tracker);

    const { totalHits } = await this.storageService.increment(key, ttl);

    const limitReached = totalHits > limit;
    if (limitReached) {
      throw new ThrottlerException();
    }
    return true;
  }
}
