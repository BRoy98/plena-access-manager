import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';
import { CreateTokenAccessLogDto } from './dto/create-token-access-log.dto';

@Injectable()
export class TokenAccessLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const key = req.headers['x-api-key'] as string;

    if (!key) {
      return next();
    }

    res.on('finish', async () => {
      const log: CreateTokenAccessLogDto = {
        key,
        success: res.statusCode < 400,
        message: res.statusMessage,
      };
      await this.loggingService.createTokenAccessLog(log);
    });

    next();
  }
}
