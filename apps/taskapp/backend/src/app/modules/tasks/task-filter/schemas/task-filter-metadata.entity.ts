import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../common/user/schemas/user.entity';
import { TaskPriority, TaskStatus } from '@taskapp/app-common';
import { Tag } from '../../tags/schemas/tag.entity';
import { List } from '../../lists/schemas/list.entity';


@Entity()
export class TaskFilterMetadataEntity {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @ApiProperty({example: 'Comment text', description: 'Название фильтра'})
  @Column({ length: 150 })
  name: string;

  @ApiProperty({ example: '2022.01.21', description: 'Создатель фильтра'})
  @ManyToMany(() => User, {onDelete: "CASCADE", nullable: true})
  @JoinTable()
  assignee: User[];

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил фильтр'})
  @ManyToMany(() => User, {onDelete: "CASCADE", nullable: true})
  @JoinTable()
  reviewer: User[];

  @ApiProperty({ example: '2022.01.21', description: 'Создатель фильтра'})
  @ManyToMany(() => User, {onDelete: "CASCADE", nullable: true})
  @JoinTable()
  createdBy: User[];

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил фильтр'})
  @ManyToMany(() => User, {onDelete: "CASCADE", nullable: true})
  @JoinTable()
  updatedBy: User[];

  @ApiProperty({ example: 'draft', description: 'Статус задачи'})
  @Column({type: "enum", enum: Object.values(TaskStatus), nullable: true})
  status: TaskStatus[];

  @ApiProperty({ example: '2022.01.21', description: 'Дата создания'})
  @CreateDateColumn({ type: "datetime", nullable: true})
  createdAt: string;

  @ApiProperty({ example: 'low', description: 'Приоритет задачи'})
  @Column({type: "enum", enum: Object.values(TaskPriority), nullable: true})
  priority: TaskPriority;

  @ApiProperty({ example: '{}', description: 'Параметры фильтра'})
  @Column({type: "json", nullable: true})
  dates: {startDate: string, endDate: string};

  @ApiProperty({example: 'true', description: 'Задача закреплена?'})
  @Column('boolean', {nullable: true})
  pinned: boolean;

  @ApiProperty({ example: 'Tag[]', description: ''})
  @ManyToMany(() => Tag, {onDelete: "CASCADE", nullable: true})
  @JoinTable()
  tags: Tag[];

  @ApiProperty({ example: 'List', description: 'Задача в списке'})
  @ManyToMany(() => List, {onDelete: "CASCADE", nullable: true})
  @JoinTable()
  list: List[];
}
