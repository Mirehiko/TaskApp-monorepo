import {ApiProperty} from "@nestjs/swagger";
import { RoleResponseDto } from '@finapp/app-common';
import { Expose } from 'class-transformer';


export class UserResponseDto {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Expose()
  id: number;

  @ApiProperty({example: 'FirstName LastName', description: 'Имя пользователя'})
  @Expose()
  name: string;

  @ApiProperty({example: 'example@email.ru', description: 'Почтовый адрес'})
  @Expose()
  email: string;

  @ApiProperty({example: 'example@email.ru', description: 'Аватарка'})
  @Expose()
  avatar?: string;

  @ApiProperty({example: 'Список ролей', description: 'Список ролей, которыми обладает пользователь'})
  @Expose()
  roles: RoleResponseDto[];

  @ApiProperty({example: 'active', description: 'Статус пользователя'})
  @Expose()
  status?: string;
}
