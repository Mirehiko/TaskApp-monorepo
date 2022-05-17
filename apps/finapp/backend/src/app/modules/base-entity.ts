import {ApiProperty} from '@nestjs/swagger';
import {
  CreateDateColumn, DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';


export class BaseEntity {
	@ApiProperty({example: '1', description: 'Уникальный идентификатор'})
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ example: '2022.01.21', description: 'Дата создания'})
	@CreateDateColumn({ type: "timestamp"})
	createdAt: string;

	@ApiProperty({ example: '2022.01.21', description: 'Дата обновления'})
	@UpdateDateColumn({ type: "timestamp"})
	updatedAt: string;

  @ApiProperty({ example: '2022.01.21', description: 'Дата удаления'})
  @DeleteDateColumn({ type: "timestamp", nullable: true})
  deletedAt: string = null;
}
