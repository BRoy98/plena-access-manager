import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  success: boolean;

  @Prop({ required: true })
  message: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
