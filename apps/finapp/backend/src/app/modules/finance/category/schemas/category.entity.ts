import { Entity, Column, ManyToOne, JoinTable, OneToMany } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from '../../../base-entity';


@Entity()
export class Category extends BaseEntity {
	@ApiProperty({example: 'Спорт', description: 'Название категории'})
	@Column({ length: 150 })
	name: string;

	@ApiProperty({example: 'Описание категории', description: 'Описание категории'})
	@Column({ length: 500 })
	description: string;

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  icon: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  color: string = '';

  @ApiProperty({ example: 'Category[]', description: 'Дочерние категории'})
  @OneToMany(() => Category, category => category.parent, { onDelete: 'CASCADE' })
  @JoinTable()
  children: Category[];

  @ApiProperty({ example: 'Category', description: 'Родительская категория'})
  @ManyToOne(() => Category, category => category.children)
  parent: Category;

  @ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
  @Column({ nullable: false })
  parent_id: number;
	// TODO: Category color, icon, parent
	// TODO: made as tree?
}
