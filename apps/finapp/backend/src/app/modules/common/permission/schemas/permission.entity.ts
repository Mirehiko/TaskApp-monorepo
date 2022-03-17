import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";


@Entity()
export class Permission {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'permissionName', description: 'Уникальное имя разрешения'})
  @Column({ length: 50 })
  name: string;

  @ApiProperty({example: 'Permission example', description: 'Название разрешения'})
  @Column({ length: 150 })
  displayName: string;

  @ApiProperty({example: 'Some description...', description: 'Описание разрешения'})
  @Column({ length: 500 })
  description: string;

  // @ManyToMany(type => Role, category => category.permissions)
  //     roles: Role[];
  // }
}
