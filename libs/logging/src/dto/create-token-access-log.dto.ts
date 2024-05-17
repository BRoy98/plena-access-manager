import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateTokenAccessLogDto {
  @IsString()
  @IsNotEmpty()
  readonly key: string;

  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly success: boolean;
}
