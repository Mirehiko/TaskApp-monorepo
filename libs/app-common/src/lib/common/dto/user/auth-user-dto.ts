import {ApiProperty} from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from 'class-validator';


export class AuthUserDto {
  @ApiProperty({example: 'example@email.ru', description: 'Почтовый адрес'})
  @IsString({message: 'Email должен быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  email: string;

  @ApiProperty({example: 'asdfs12casd;', description: 'Пароль'})
  @IsString({message: 'Должно быть строкой'})
    // @Length(6, 20, {message: 'Значение от 6 до 20 символов'})
  password: string;
}
