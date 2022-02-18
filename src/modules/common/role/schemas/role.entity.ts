import {Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Permission} from "../../permission/schemas/permission.entity";

@Entity()
export class Role {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'ADMIN', description: 'Уникальное название роли'})
    @Column({ length: 50 })
    name: string;

    @ApiProperty({example: 'Администратор', description: 'Название роли'})
    @Column({ length: 150 })
    displayName: string;

    @ApiProperty({example: 'Некоторое описание роли', description: 'Описание роли'})
    @Column({ length: 500 })
    description: string;

    @ApiProperty({example: 'Список разрешений', description: 'Список разрешений, которыми обладает роль'})
    // @ManyToMany(() => Permission, permission => permission.id, {onDelete: "NO ACTION"})
    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];
}
