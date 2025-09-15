import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserResultDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
