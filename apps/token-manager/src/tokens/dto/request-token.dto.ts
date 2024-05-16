import { IsString, IsNotEmpty } from 'class-validator';

export class RequestTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly key: string;
}
