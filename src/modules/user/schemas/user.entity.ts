import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    name: string;

    @Column({ length: 150 })
    email: string;

    @Column({ length: 150 })
    password: string;

    @Column('text')
    avatar: string;
}
