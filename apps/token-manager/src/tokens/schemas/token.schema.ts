import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
