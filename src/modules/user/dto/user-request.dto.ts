import { ID } from '../../../shared/types/id.type';
import {ApiOperation, ApiProperty} from "@nestjs/swagger";
import {Column, PrimaryGeneratedColumn} from "typeorm";

export class UserRequestDto {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  id?: ID;

  @ApiProperty({example: 'FirstName LastName', description: 'Имя пользователя'})
  name: string;

  @ApiProperty({example: 'example@email.ru', description: 'Почтовый адрес'})
  email: string;

  @ApiProperty({example: 'asdfs12casd;', description: 'Пароль'})
  permissions: string[];

  @ApiProperty({example: 'example@email.ru', description: 'Аватарка'})
  avatar: string;
}
