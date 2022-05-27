import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent
} from 'typeorm';
import { BaseEntity } from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { Task } from '../../task/schemas/task.entity';
import { TreeEntity } from '../../../base-tree-repository';


@Entity()
@Tree("materialized-path")
export class Tag extends BaseEntity implements TreeEntity<Tag> {

  @ApiProperty({example: 'Do homework', description: 'Task name'})
  @Column({ length: 150 })
  name: string;

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  icon: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  color: string = '';

  @ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  createdBy: User;

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  updatedBy: User;

  @ApiProperty({ example: 'Tag[]', description: 'Дочерние задачи'})
  @TreeChildren()
  children: Tag[];

  @ApiProperty({ example: 'Tag', description: 'Родительская задача'})
  @TreeParent({ onDelete: 'CASCADE' })
  parent: Tag;

  @ApiProperty({ example: '2', description: 'Id родительского тега'})
  @Column({ nullable: false })
  parent_id: number = -1;

  @ApiProperty({ example: 'Task[]', description: 'Задачи с данным тегом'})
  @ManyToMany(() => Task, task => task.tags)
  tasks: Task[];

}
