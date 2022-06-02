import { Expose } from 'class-transformer';


export class PermissionResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    displayName: string;

    @Expose()
    description: string;
}
