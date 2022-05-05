import {ApiOperation, ApiProperty} from "@nestjs/swagger";
import { RequestObjectWithId } from '@finapp/app-common';
import { IsOptional, IsString } from 'class-validator';

export class PermissionRequestDto implements RequestObjectWithId {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @IsOptional()
    id?: number;

    @ApiProperty({example: 'permissionName', description: 'Уникальное название разрешения'})
    @IsString()
    name: string;

    @ApiProperty({example: 'Permission', description: 'Отображаемое имя разрешения'})
    @IsString()
    displayName: string;

    @ApiProperty({example: 'Description here ....', description: 'Описание разрешения'})
    @IsString()
    description: string;
}
