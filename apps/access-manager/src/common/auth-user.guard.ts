import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { KeysService } from '../keys/keys.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly keysService: KeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const keyDetails = await this.keysService.findByKey(apiKey);
    if (
      !keyDetails ||
      keyDetails.disabled ||
      new Date(keyDetails.expiration) < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    request['userId'] = keyDetails.userId; // Attach userId to the request object
    return true;
  }
}
