import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base-entity';


@Entity()
export class Tag extends BaseEntity {

  @ApiProperty({example: 'Do homework', description: 'Task name'})
  @Column({ length: 150 })
  name: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  icon: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  color: string = '';

  @ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
  @ManyToOne(() => Tag, tag => tag.id, { onDelete: 'CASCADE' })
  @JoinTable()
  children: Tag[];

  @ApiProperty({ example: 'Данные пользователя', description: 'Операция проведена пользователем'})
  @Column({ nullable: false })
  parent_id: number;
}
