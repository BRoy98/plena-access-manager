import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateKeyDto {
  @IsNumber()
  @IsOptional()
  readonly rateLimit?: number;

  @IsDateString()
  @IsOptional()
  readonly expiration?: Date;
}
