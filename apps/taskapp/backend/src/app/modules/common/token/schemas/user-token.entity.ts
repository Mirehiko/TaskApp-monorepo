import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import {User} from "../../user/schemas/user.entity";
import {ApiProperty} from "@nestjs/swagger";
import {UserStatusEnum} from '../../user/user-status.enum';


@Entity()
export class UserToken {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'afs2342dffgsdfg234dsfg', description: 'Токен'})
  @Column({ nullable: false, unique: true })
  token: string;

  @ApiProperty({example: 1, description: 'Id пользователя'})
  @OneToOne(() => User, user => user.id)
  @JoinColumn({})
  userId: number;

  @ApiProperty({example: '// TODO: Добавить пример', description: 'Дата окончания действия токена'})
  @Column({ nullable: false })
  expireAt: Date = new Date();
}
