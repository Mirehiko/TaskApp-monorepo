import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../base-entity';
import { User } from '../../../common/user/schemas/user.entity';
import { ITaskFilterParams, TaskFilterType } from '@finapp/app-common';
import { TaskFilterMetadataEntity } from './task-filter-metadata.entity';


@Entity()
export class TaskFilterEntity extends BaseEntity {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'Comment text', description: 'Название фильтра'})
  @Column({ length: 150 })
  name: string;

  @ApiProperty({ example: '2022.01.21', description: 'Создатель фильтра'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  createdBy: User;

  @ApiProperty({ example: '2022.01.21', description: 'Человек, который последним обновил фильтр'})
  @ManyToOne(() => User, user => user.id)
  @JoinTable()
  updatedBy: User;

  @ApiProperty({ example: 'Custom', description: 'Тип фильтра'})
  @Column({type: "enum", enum: Object.values(TaskFilterType), default: TaskFilterType.CUSTOM})
  type: TaskFilterType = TaskFilterType.CUSTOM;

  @ApiProperty({ example: 'TaskFilterMetadataEntity', description: 'Параметры фильтра'})
  @OneToOne(() => TaskFilterMetadataEntity)
  @JoinColumn()
  metadata?: TaskFilterMetadataEntity;
}
