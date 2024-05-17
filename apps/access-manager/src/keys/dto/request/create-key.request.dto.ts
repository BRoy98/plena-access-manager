import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateKeyDto {
  @IsString()
  @IsOptional()
  readonly key?: string;

  @IsNumber()
  @IsNotEmpty()
  readonly rateLimit: number;

  @IsDateString()
  @IsNotEmpty()
  readonly expiration: Date;

  @IsString()
  @IsNotEmpty()
  readonly createdBy: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
