import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../role/schemas/role.entity";
import {RequestObjectWithId} from "../../../../interfaces/objectWithId";
import {IsEmail, IsString, Length} from "class-validator";

export class UserRequestDto implements RequestObjectWithId {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  id?: number;

  @ApiProperty({example: 'FirstName LastName', description: 'Имя пользователя'})
  // @IsString({message: 'Должно быть строкой'})
  name?: string;

  @ApiProperty({example: 'example@email.ru', description: 'Почтовый адрес'})
  // @IsString({message: 'Должно быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  email?: string;

  @ApiProperty({example: 'active', description: 'Статус пользователя'})
  status?: string;

  @ApiProperty({example: 'asdfs12casd;', description: 'Пароль'})
  // @IsString({message: 'Должно быть строкой'})
  @Length(6, 20, {message: 'Значение от 6 до 20 символов'})
  password?: string;

  @ApiProperty({example: 'example@email.ru', description: 'Аватарка'})
  avatar?: string;

  @ApiProperty({example: 'Список ролей', description: 'Список ролей, которыми обладает пользователь'})
  roles?: Role[];
}
