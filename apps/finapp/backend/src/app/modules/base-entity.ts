import {ApiProperty} from '@nestjs/swagger';
import {Column, PrimaryGeneratedColumn} from 'typeorm';


export class BaseEntity {
	@ApiProperty({example: '1', description: 'Уникальный идентификатор'})
	@PrimaryGeneratedColumn()
	id: number;
	
	@ApiProperty({ example: '2022.01.21', description: 'Дата создания'})
	@Column("timestamp")
	createdAt: Date = new Date();
	
	@ApiProperty({ example: '2022.01.21', description: 'Дата обновления'})
	@Column("timestamp")
	updatedAt: Date = new Date();
}