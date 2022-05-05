import {ApiProperty} from "@nestjs/swagger";
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { RequestObjectWithId, RoleRequestDto, RoleResponseDto } from '@finapp/app-common';


export class UserRequestDto implements RequestObjectWithId {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({example: 'FirstName LastName', description: 'Имя пользователя'})
  @IsOptional()
  @IsString({message: 'Должно быть строкой'})
  name: string;

  @ApiProperty({example: 'example@email.ru', description: 'Почтовый адрес'})
  @IsString({message: 'Email должен быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  email?: string;

  @ApiProperty({example: 'active', description: 'Статус пользователя'})
  @IsOptional()
  status?: string;

  @ApiProperty({example: 'asdfs12casd;', description: 'Пароль'})
  // @IsString({message: 'Должно быть строкой'})
  @IsOptional()
  // @Length(6, 20, {message: 'Значение от 6 до 20 символов'})
  password?: string;

  @ApiProperty({example: 'example@email.ru', description: 'Аватарка'})
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({example: 'Список ролей', description: 'Список ролей, которыми обладает пользователь'})
  @IsOptional()
  @IsArray()
  roles?: RoleRequestDto[];
}
