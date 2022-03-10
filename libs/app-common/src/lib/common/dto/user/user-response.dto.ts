import {ApiProperty} from "@nestjs/swagger";
import { RoleResponseDto } from '@finapp/app-common';


export class UserResponseDto {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  id: number;

  @ApiProperty({example: 'FirstName LastName', description: 'Имя пользователя'})
  name: string;

  @ApiProperty({example: 'example@email.ru', description: 'Почтовый адрес'})
  email: string;

  @ApiProperty({example: 'example@email.ru', description: 'Аватарка'})
  avatar?: string;

  @ApiProperty({example: 'Список ролей', description: 'Список ролей, которыми обладает пользователь'})
  roles: RoleResponseDto[];

  @ApiProperty({example: 'active', description: 'Статус пользователя'})
  status?: string;
}
