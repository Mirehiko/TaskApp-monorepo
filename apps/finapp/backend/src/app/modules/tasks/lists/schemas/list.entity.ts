import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base-entity';
import { Task } from '../../task/schemas/task.entity';
import { ListBehaviorType, ListType } from '@finapp/app-common';
import { User } from '../../../common/user/schemas/user.entity';


@Entity()
export class List extends BaseEntity {

  @ApiProperty({example: 'Do homework', description: 'Task name'})
  @Column({ length: 150 })
  name: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  icon: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  color: string = '';

  @ApiProperty({ example: 'folder', description: 'Тип списка задачи'})
  @Column({type: "enum", enum: Object.values(ListType), default: ListType.LIST})
  type: ListType;

  @ApiProperty({ example: 'folder', description: 'Тип списка задачи'})
  @Column({type: "enum", enum: Object.values(ListBehaviorType), default: ListBehaviorType.PERSONAL})
  behavior_type: ListBehaviorType;

  @ApiProperty({ example: 'List[]', description: 'Дочерние списки'})
  @OneToMany(() => List, list => list.parent, { onDelete: 'CASCADE' })
  @JoinTable()
  children: List[];

  @ApiProperty({ example: 'List', description: 'Родительский список'})
  @ManyToOne(() => List, list => list.children)
  parent: List;

  @ApiProperty({ example: '2', description: 'Id родительского списка'})
  @Column({ nullable: false })
  parent_id: number;

  @ApiProperty({ example: 'Task[]', description: 'Задачи в списке'})
  @OneToMany(() => Task, task => task.list)
  tasks: Task[];

  @ApiProperty({ example: 'false', description: 'Архивный список'})
  @Column('boolean')
  archived: boolean = false;

  @ApiProperty({ example: 'false', description: 'Общий список'})
  @Column('boolean')
  is_common: boolean = false;

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  createdBy: User;

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  updatedBy: User;
}
