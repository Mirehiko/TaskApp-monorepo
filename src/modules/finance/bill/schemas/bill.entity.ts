import { Exclude } from 'class-transformer';
import {Entity, Column, ManyToOne, JoinTable, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import { UserResponse } from '../../../../shared/interfaces/user';
import {BaseEntity} from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';

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
	
	@ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
	@ManyToMany(() => User, user => user.id)
	@JoinTable()
	user: User;
	
	@ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	createdBy: User;
	
	@ApiProperty({ example: 'Данные пользователя', description: 'Операция обновлена пользователем'})
	@ManyToOne(() => User, user => user.id)
	@JoinTable()
	updatedBy: User;
	
	@ApiProperty({ example: 'active', description: 'Статус операции'})
	@Column({type: "enum", enum: Object.values(OperationStatus), default: OperationStatus.PENDING})
	status: string;
	
	@ApiProperty({ example: 'active', description: 'Тип операции'})
	@Column({type: "enum", enum: Object.values(OperationType), default: OperationType.})
	type: string;
}
