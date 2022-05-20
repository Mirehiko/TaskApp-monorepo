import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent
} from 'typeorm';
import { BaseEntity } from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { TaskBehavior, TaskPriority, TaskStatus } from '@finapp/app-common';
import { Tag } from '../../tags/schemas/tag.entity';
import { List } from '../../lists/schemas/list.entity';
import { TreeEntity } from '../../../base-tree-repository';


@Entity()
@Tree("materialized-path")
export class Task extends BaseEntity implements TreeEntity<Task> {

	@ApiProperty({example: 'Do homework', description: 'Task name'})
	@Column({ length: 150 })
	name: string = '';

	@ApiProperty({example: 'Description here', description: 'Описание задачи'})
	@Column({ length: 150 })
	description: string = '';

	@ApiProperty({example: 'file', description: 'Иконка задачи'})
	@Column('text')
	icon: string = '';

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей работающих над задачей'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	assignee: User = null;

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей проверяющих задачю'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	reviewer: User = null;

	@ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	createdBy: User;

	@ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	updatedBy: User;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
	@Column({type: "enum", enum: Object.values(TaskStatus), default: TaskStatus.DRAFT})
	status: TaskStatus;

  @ApiProperty({ example: 'Task[]', description: 'Дочерние задачи'})
  @TreeChildren()
  children: Task[];

  @ApiProperty({ example: 'Task', description: 'Родительская задача'})
  @TreeParent({ onDelete: 'CASCADE' })
  parent: Task;

  @ApiProperty({ example: '2', description: 'Id родительской задачи'})
  @Column({ nullable: false })
  parent_id: number = -1;

  @ApiProperty({ example: 'Tag[]', description: 'Список тегов'})
  @ManyToMany(() => Tag, tag => tag.tasks)
  @JoinTable()
  tags: Tag[];

  @ApiProperty({ example: 'List[]', description: 'Задача в списках'})
  @ManyToMany(() => List)
  @JoinTable()
  lists: List[];

  @ApiProperty({ example: 'low', description: 'Приоритет задачи'})
  @Column({type: "enum", enum: Object.values(TaskPriority), default: TaskPriority.NONE})
  priority: TaskPriority;

  @ApiProperty({example: 'true', description: 'Задача закреплена?'})
  @Column('boolean')
  pinned: boolean = false;

  @ApiProperty({ example: 'default', description: 'Поведение задачи'})
  @Column({type: "enum", enum: Object.values(TaskBehavior), default: TaskBehavior.DEFAULT})
  taskBehavior: TaskBehavior;

  @ApiProperty({ example: '2022.01.21', description: 'Дата удаления'})
  // @Column({type: "datetime", default: () => "UTC_TIMESTAMP(6)", nullable: true})
  @Column({type: "datetime", nullable: true})
  startDate: string = null;

  @ApiProperty({ example: '2022.01.21', description: 'Дата удаления'})
  @Column({type: "datetime", nullable: true})
  endDate: string = null;

  // TODO: move some information to different metadata?
}
