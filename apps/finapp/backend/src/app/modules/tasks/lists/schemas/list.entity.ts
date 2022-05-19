import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base-entity';
import { Task } from '../../task/schemas/task.entity';


@Entity()
export class List extends BaseEntity {

  @ApiProperty({example: 'Do homework', description: 'Task name'})
  @Column({ length: 150 })
  name: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  icon: string = '';

  @ApiProperty({example: 'file', description: 'Иконка задачи'})
  @Column('text')
  color: string = '';

  @ApiProperty({ example: 'List[]', description: 'Дочерние списки'})
  @OneToMany(() => List, list => list.parent, { onDelete: 'CASCADE' })
  @JoinTable()
  children: List[];

  @ApiProperty({ example: 'List', description: 'Родительский список'})
  @ManyToOne(() => List, list => list.children)
  parent: List;

  @ApiProperty({ example: '2', description: 'Id родительского списка'})
  @Column({ nullable: false })
  parent_id: number;

  @ApiProperty({ example: 'Task[]', description: 'Задачи в списке'})
  @ManyToMany(() => Task, task => task.tags)
  tasks: Task[];
}
