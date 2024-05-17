import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateKeyDto {
  @IsString()
  @IsNotEmpty()
  readonly key: string;

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
