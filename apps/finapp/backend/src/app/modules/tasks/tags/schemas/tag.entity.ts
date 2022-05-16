import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
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

  @ApiProperty({ example: 'Tag[]', description: 'Дочерние теги'})
  @OneToMany(() => Tag, tag => tag.parent, { onDelete: 'CASCADE' })
  @JoinTable()
  children: Tag[];

  @ApiProperty({ example: 'Tag', description: 'Родительский тег'})
  @ManyToOne(() => Tag, tag => tag.children)
  parent: Tag;

  @ApiProperty({ example: '2', description: 'Id родительского тега'})
  @Column({ nullable: false })
  parent_id: number;
}
