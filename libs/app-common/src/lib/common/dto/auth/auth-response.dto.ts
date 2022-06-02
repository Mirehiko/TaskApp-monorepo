import { IsNotEmpty } from 'class-validator';
import { UserResponseDto } from '../user/user-response.dto';


export class AuthResponseDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  user: UserResponseDto;
}
