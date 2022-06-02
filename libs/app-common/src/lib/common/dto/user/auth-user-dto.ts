import { IsEmail, IsOptional, IsString } from 'class-validator';


export class AuthUserDto {
  @IsString({message: 'Email должен быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  email: string;

  @IsString({message: 'Должно быть строкой'})
    // @Length(6, 20, {message: 'Значение от 6 до 20 символов'})
  password: string;
}
