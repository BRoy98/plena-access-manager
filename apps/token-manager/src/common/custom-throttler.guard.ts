import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    @InjectThrottlerOptions()
    protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage()
    protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
    @Inject(TokensService) private tokensService: TokensService,
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(context: ExecutionContext): Promise<string> {
    const key = context.getArgByIndex(0).body.key;
    return key;
  }

  protected generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string,
  ): string {
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${name}`;
    const key = this.getTracker(context);
    return `${prefix}:${key}`;
  }

  async getHandlerLimit(context: ExecutionContext): Promise<number> {
    const key = await this.getTracker(context);
    const keyDetails = await this.tokensService.validateKey(key);
    return keyDetails.rateLimit;
  }

  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions,
  ): Promise<boolean> {
    const key = this.generateKey(context, '', throttler.name);
    const { totalHits } = await this.storageService.increment(key, ttl);
    const limitReached = totalHits > limit;
    if (limitReached) {
      throw new ThrottlerException();
    }
    return true;
  }
}
