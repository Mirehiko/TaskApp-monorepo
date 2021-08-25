import {ApiOperation, ApiProperty} from "@nestjs/swagger";

export class PermissionResponseDto {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    id: number;

    @ApiProperty({example: 'permissionName', description: 'Уникальное название разрешения'})
    name: string;

    @ApiProperty({example: 'Permission', description: 'Отображаемое имя разрешения'})
    displayName: string;

    @ApiProperty({example: 'Description here ....', description: 'Описание разрешения'})
    description: string;
}