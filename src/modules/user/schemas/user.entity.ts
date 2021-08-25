import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../role/schemas/role.entity";

@Entity()
export class User {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'FirstName LastName', description: 'Имя пользователя'})
    @Column({ length: 150 })
    name: string;

    @ApiProperty({example: 'example@email.ru', description: 'Почтовый адрес'})
    @Column({ length: 150 })
    email: string;

    @ApiProperty({example: 'asdfs12casd;', description: 'Пароль'})
    @Column({ length: 150 })
    password: string;

    @ApiProperty({example: 'example@email.ru', description: 'Аватарка'})
    @Column('text')
    avatar: string;

    @ManyToMany(() => Role, x => x.id)
    @JoinTable()
    roles: Role[];
}
