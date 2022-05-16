import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent
} from 'typeorm';
import { BaseEntity } from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { TaskStates } from '@finapp/app-common';
import { Tag } from '../../tags/schemas/tag.entity';
import { List } from '../../lists/schemas/list.entity';


@Entity()
@Tree("materialized-path")
export class Task extends BaseEntity {

	@ApiProperty({example: 'Do homework', description: 'Task name'})
	@Column({ length: 150 })
	name: string = '';

	@ApiProperty({example: 'Description here', description: 'Описание задачи'})
	@Column({ length: 150 })
	description: string;

	@ApiProperty({example: 'file', description: 'Иконка задачи'})
	@Column('text')
	icon: string = '';

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей работающих над задачей'})
	@ManyToMany(() => User, user => user.id)
	@JoinTable()
	assignee: User[];

	@ApiProperty({ example: '2022.01.21', description: 'Список пользователей проверяющих задачю'})
	@ManyToMany(() => User, user => user.id)
	@JoinTable()
	reviewer: User;

	@ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	createdBy: User;

	@ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	updatedBy: User;

	@ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
	@Column({type: "timestamp", nullable: true})
	dateDue: Date = null;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
	@Column({type: "enum", enum: Object.values(TaskStates), default: TaskStates.DRAFT})
	status: TaskStates;

  @ApiProperty({ example: 'Task[]', description: 'Дочерние задачи'})
  // @OneToMany(() => Task, task => task.parent, { onDelete: 'CASCADE' })
  // @JoinTable()
  @TreeChildren()
  children: Task[];

  @ApiProperty({ example: 'Task', description: 'Родительская задача'})
  // @ManyToOne(() => Task, task => task.children)
  @TreeParent({ onDelete: 'CASCADE' })
  parent: Task;

  @ApiProperty({ example: 'Tag[]', description: 'Список тегов'})
  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ApiProperty({ example: 'List[]', description: 'Задача в списках'})
  @ManyToMany(() => List)
  @JoinTable()
  lists: List[];

  @ApiProperty({ example: '2', description: 'Id родительской задачи'})
  @Column({ nullable: false })
  parent_id: number = -1;

	// config?: TaskConfig;
}
