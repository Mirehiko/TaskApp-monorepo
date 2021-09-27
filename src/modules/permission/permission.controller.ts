import {Body, Controller, Delete, Get, Param, Patch, Post, Res} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {PermissionService} from "./permission.service";
import {Permission} from "./schemas/permission.entity";
import {PermissionResponseDto} from "./dto/permission-response.dto";
import {PermissionRequestDto} from "./dto/permission-request.dto";

@ApiTags('Разрешения')
@Controller('/api/main/')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {
    }

    @ApiOperation({summary: 'Получение списка разрешений'})
    @ApiResponse({status: 200, type: [Permission]})
    @Get('permissions')
    getPermissions(): Promise<PermissionResponseDto[]> {
        return this.permissionService.getAll();
    }

    @ApiOperation({summary: 'Получение разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Get('permission/:id')
    getPermissionById(@Param('id') id: number): Promise<PermissionResponseDto> {
        return this.permissionService.getByID(id);
    }

    @ApiOperation({summary: 'Обновление разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Patch('permission/:id')
    updatePermission(
        @Param('id') id: string,
        @Body() permissionRequestDto: PermissionRequestDto
    ): Promise<PermissionRequestDto> {
        return this.permissionService.updatePermission(id, permissionRequestDto);
    }

    // @ApiOperation({summary: 'Получение роли'})
    // @ApiResponse({status: 200, type: Role})
    // @Get('role/:id')
    // getPermissionBy(@Param() params: any, @Res() response): Promise<RoleResponseDto> {
    //     return this.permissionService.getBy(params, response);
    // }

    @ApiOperation({summary: 'Создание разрешения'})
    @ApiResponse({status: 201, type: Permission})
    @Post('permission')
    createPermission(@Body() permissionRequestDto: PermissionRequestDto): Promise<any> {
        return this.permissionService.createPermission(permissionRequestDto);
    }

    @ApiOperation({summary: 'Удаление разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Delete('permission/:id')
    deletePermission(@Param('id') id: number): Promise<any> {

        return this.permissionService.deletePermission(id);
    }
}
