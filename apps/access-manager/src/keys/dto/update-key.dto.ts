import { IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdateKeyDto {
  @IsNumber()
  @IsOptional()
  readonly rateLimit?: number;

  @IsDateString()
  @IsOptional()
  readonly expiration?: Date;

  @IsString()
  @IsOptional()
  readonly createdBy?: string;
}
