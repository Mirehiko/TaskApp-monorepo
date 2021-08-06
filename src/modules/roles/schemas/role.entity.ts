import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Role {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'ADMIN', description: 'Программное название роли'})
    @Column({ length: 50 })
    name: string;

    @ApiProperty({example: 'Администратор', description: 'Название роли'})
    @Column({ length: 150 })
    displayName: string;

    @ApiProperty({example: 'Некоторое описание роли', description: 'Описание роли'})
    @Column({ length: 500 })
    description: string;
}
