import { IsString, IsNotEmpty } from 'class-validator';

export class GetKeyDetailsDto {
  @IsString()
  @IsNotEmpty()
  readonly key: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
