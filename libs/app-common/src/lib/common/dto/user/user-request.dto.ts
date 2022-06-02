import { IsArray, IsEmail, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { RequestObjectWithId, RoleRequestDto, RoleResponseDto } from '@finapp/app-common';


export class UserRequestDto implements RequestObjectWithId {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString({message: 'Должно быть строкой'})
  name: string;

  @IsString({message: 'Email должен быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  email?: string;

  @IsOptional()
  status?: string;

  // @IsString({message: 'Должно быть строкой'})
  @IsOptional()
  // @Length(6, 20, {message: 'Значение от 6 до 20 символов'})
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsArray()
  roles?: RoleRequestDto[];
}
