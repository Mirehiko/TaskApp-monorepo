import { Entity, Column, ManyToOne, JoinTable, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {BaseEntity} from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { TreeEntity } from '../../../base-tree-repository';


@Entity()
@Tree("materialized-path")
export class Category extends BaseEntity implements TreeEntity<Category> {

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
  @TreeChildren()
  children: Category[];

  @ApiProperty({ example: 'Category', description: 'Родительская категория'})
  @TreeParent({ onDelete: 'CASCADE' })
  parent: Category;

  @ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
  @Column({ nullable: false })
  parent_id: number;

  @ApiProperty({ example: '2022.01.21', description: 'Создатель задачи'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  createdBy: User;

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил задачу'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  updatedBy: User;

	// TODO: Category color, icon, parent
	// TODO: made as tree?
}
