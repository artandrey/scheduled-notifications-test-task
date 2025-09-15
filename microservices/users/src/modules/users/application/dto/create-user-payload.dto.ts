import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserPayloadDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
