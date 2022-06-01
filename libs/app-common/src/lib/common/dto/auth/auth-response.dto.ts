import { IsNotEmpty } from 'class-validator';
import { UserResponseDto } from '@finapp/app-common';


export class AuthResponseDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  user: UserResponseDto;
}
