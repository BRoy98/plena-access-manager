import { IsString, IsNotEmpty } from 'class-validator';

export class DisableKeyDto {
  @IsString()
  @IsNotEmpty()
  readonly key: string;
}
