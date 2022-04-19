import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { TaskStates } from '../../../../../../../../../libs/app-common/src/lib/tasks/enums/task-states';
import { BaseEntity } from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';


@Entity()
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
	reviewer: User[];

	@ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
	@OneToOne(() => User, user => user.id)
	@JoinTable()
	createdBy: User;

	@ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
	@OneToOne(() => User, user => user.id)
	@JoinTable()
	updatedBy: User;

	@ApiProperty({ example: '2022.01.21', description: 'Дата завершения'})
	@Column({type: "timestamp", nullable: true})
	dateDue: Date = null;

	@ApiProperty({ example: 'draft', description: 'Статус задачи'})
	@Column({type: "enum", enum: Object.values(TaskStates), default: TaskStates.DRAFT})
	status: string;

	// config?: TaskConfig;
}
