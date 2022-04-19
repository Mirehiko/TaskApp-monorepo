import { Exclude } from 'class-transformer';
import {Entity, Column, ManyToOne, JoinTable, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';

@Entity()
export class Category extends BaseEntity {
	@ApiProperty({example: 'Спорт', description: 'Название категории'})
	@Column({ length: 150 })
	name: string;

	@ApiProperty({example: 'Описание категории', description: 'Описание категории'})
	@Column({ length: 500 })
	description: string;

	// @ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
	// @OneToOne(() => User, operation => operation.id)
	// @JoinTable()
	// parent: Category[];

	@ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
	@ManyToOne(() => Category, category => category.id)
	@JoinTable()
	children: Category[];

  @ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
  @Column({ nullable: true })
  parent_id: number;
	// TODO: Category color, icon, parent
	// TODO: made as tree?
}
