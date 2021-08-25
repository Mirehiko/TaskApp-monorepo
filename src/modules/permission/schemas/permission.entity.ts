import {Column, Entity, JoinTable, ManyToMany, ObjectIdColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../role/schemas/role.entity";

@Entity()
export class Permission {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @ObjectIdColumn()
    id: string;

    @ApiProperty({example: 'permissionName', description: 'Уникальное имя разрешения'})
    @Column({ length: 50 })
    name: string;

    @ApiProperty({example: 'Permission example', description: 'Название разрешения'})
    @Column({ length: 150 })
    displayName: string;

    @ApiProperty({example: 'Some description...', description: 'Описание разрешения'})
    @Column({ length: 500 })
    description: string;

    // @ManyToMany(type => Role, role => role.permissions)
    //     roles: Role[];
    // }

}
