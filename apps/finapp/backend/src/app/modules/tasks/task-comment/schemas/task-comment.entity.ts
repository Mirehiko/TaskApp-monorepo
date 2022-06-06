import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { TextType } from '@finapp/app-common';
import { Task } from '../../task/schemas/task.entity';


@Entity()
export class TaskCommentEntity extends BaseEntity {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'Comment text', description: 'Текст комментария'})
  @Column({ length: 500 })
  body: string;

  @ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  createdBy: User;

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  updatedBy: User;

  @ApiProperty({ example: 'User[]', description: 'Уведомить пользователей'})
  @ManyToMany(() => User, user => user.mentionedIn, {nullable: true})
  @JoinTable()
  notifyUsers: User[];

  @ApiProperty({ example: 'Markdown', description: 'Формат вводимого текста'})
  @Column({type: "enum", enum: Object.values(TextType), default: TextType.DEFAULT})
  textType: TextType = TextType.DEFAULT;

  @ApiProperty({ example: '{}', description: 'Задача, к которой линкуются комментарии'})
  @ManyToOne(() => Task, task => task.comments)
  @JoinTable()
  task: Task;
}
