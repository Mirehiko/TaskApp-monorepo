import { RequestObjectWithId } from '@finapp/app-common';
import { IsOptional, IsString } from 'class-validator';


export class PermissionRequestDto implements RequestObjectWithId {
    @IsOptional()
    id?: number;

    @IsString()
    name: string;

    @IsString()
    displayName: string;

    @IsString()
    description: string;
}
