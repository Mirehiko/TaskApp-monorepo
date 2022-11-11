import {Entity, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import { User } from '../../../common/user/schemas/user.entity';
import { Category } from '../../category/schemas/category.entity';


@Entity()
export class OperationMetadata {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'Комментарий', description: 'Какой-то текст'})
  @OneToOne(() => User, user => user.id)
  user: User;

  @ApiProperty({example: 'Категория', description: 'Какой-то текст'})
  @OneToOne(() => Category, category => category.id)
  category: Category;
}
