import { Exclude } from 'class-transformer';
import {Entity, Column, ManyToOne, ManyToMany, JoinTable, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { Bill } from '../../bill/schemas/bill.entity';
import { Category } from '../../category/schemas/category.entity';
import { OperationStatus, OperationType } from '@finapp/app-common';
import { OperationMetadata } from './operation-metadata';


@Entity()
export class Operation extends BaseEntity {
	@ApiProperty({example: '143.4', description: 'Сумма операции'})
	@Column()
	value: number = 0;

	@ApiProperty({example: 'Комментарий', description: 'Какой-то текст'})
	@Column({ length: 150 })
	comment: string;

	@ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	createdBy: User;

	@ApiProperty({ example: 'Данные счета', description: 'Счет'})
	@ManyToOne(() => Bill)
	@JoinTable()
	bill: Bill;

	@ApiProperty({ example: 'active', description: 'Статус операции'})
	@Column({type: "enum", enum: Object.values(OperationStatus), default: OperationStatus.PENDING})
	status: string;

	@ApiProperty({ example: 'active', description: 'Тип операции'})
	@Column({type: "enum", enum: Object.values(OperationType)})
	type: OperationType;

	@ApiProperty({ example: 'active', description: 'Категория операции'})
	@ManyToMany(() => Category, category => category.id)
	@JoinTable()
	metadata: OperationMetadata;

	// metadata: string;
}
