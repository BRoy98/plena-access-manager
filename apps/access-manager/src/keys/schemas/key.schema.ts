import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type KeyDocument = HydratedDocument<Key>;

@Schema()
export class Key {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  rateLimit: number;

  @Prop({ required: true })
  expiration: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: false })
  disabled: boolean;

  @Prop({ required: true })
  userId: string;
}

export const KeySchema = SchemaFactory.createForClass(Key);
