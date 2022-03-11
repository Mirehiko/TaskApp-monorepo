import {ApiOperation, ApiProperty} from "@nestjs/swagger";
import { Expose } from 'class-transformer';

export class PermissionResponseDto {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Expose()
    id: number;

    @ApiProperty({example: 'permissionName', description: 'Уникальное название разрешения'})
    @Expose()
    name: string;

    @ApiProperty({example: 'Permission', description: 'Отображаемое имя разрешения'})
    @Expose()
    displayName: string;

    @ApiProperty({example: 'Description here ....', description: 'Описание разрешения'})
    @Expose()
    description: string;
}
