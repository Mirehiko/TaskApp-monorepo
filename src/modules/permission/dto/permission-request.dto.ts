import {ApiOperation, ApiProperty} from "@nestjs/swagger";
import {RequestObjectWithId} from "../../../interfaces/objectWithId";

export class PermissionRequestDto implements RequestObjectWithId {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    id?: number;

    @ApiProperty({example: 'permissionName', description: 'Уникальное название разрешения'})
    name: string;

    @ApiProperty({example: 'Permission', description: 'Отображаемое имя разрешения'})
    displayName: string;

    @ApiProperty({example: 'Description here ....', description: 'Описание разрешения'})
    description: string;
}
