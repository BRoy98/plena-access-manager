import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { CreateTokenAccessLogDto } from './dto/create-token-access-log.dto';

@Injectable()
export class LoggingService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createTokenAccessLog(
    createLogDto: CreateTokenAccessLogDto,
  ): Promise<Log> {
    const createdLog = new this.logModel({
      ...createLogDto,
      timestamp: new Date(),
    });
    return createdLog.save();
  }
}
