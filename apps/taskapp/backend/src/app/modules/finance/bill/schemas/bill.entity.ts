import { Entity, Column, ManyToOne } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { BillStatus, BillType } from '@taskapp/app-common';


@Entity()
export class Bill extends BaseEntity {
	@ApiProperty({example: '143.4', description: 'Баланс счета'})
	@Column()
	balance: number = 0;

	@ApiProperty({example: 'Комментарий', description: 'Название счета'})
	@Column({ length: 150 })
	name: string;

	@ApiProperty({example: 'Описание', description: 'Описание счета'})
	@Column({ length: 500 })
	description: string;

	@ApiProperty({ example: 'Идентификатор пользователя', description: 'Счет пользователя'})
	@ManyToOne(() => User, user => user.bills, {nullable: true})
  // @JoinTable()
	user: User;

	@ApiProperty({ example: 'Данные пользователя', description: 'Счет создан пользователем'})
	@ManyToOne(() => User, { onDelete: "SET NULL" })
	// @JoinTable()
  createdBy: User;

	@ApiProperty({ example: 'Данные пользователя', description: 'Счет обновлен пользователем'})
	@ManyToOne(() => User, { onDelete: "SET NULL" })
	// @JoinTable()
  updatedBy: User;

	@ApiProperty({ example: 'active', description: 'Статус счета'})
	@Column({type: "enum", enum: Object.values(BillStatus), default: BillStatus.ACTIVE})
	status: string;

	@ApiProperty({ example: 'active', description: 'Тип счета'})
	@Column({type: "enum", enum: Object.values(BillType)})
	type: string;
}
