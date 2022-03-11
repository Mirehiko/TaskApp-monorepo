import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { GetParamsData } from '../../base-service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {PermissionService} from "./permission.service";
import {Permission} from "./schemas/permission.entity";
import { PermissionRequestDto, PermissionResponseDto } from '@finapp/app-common';


@ApiTags('Разрешения')
@Controller('main')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {
    }

    @ApiOperation({summary: 'Получение списка разрешений'})
    @ApiResponse({status: 200, type: [Permission]})
    @Get('permissions')
    async getPermissions(): Promise<PermissionResponseDto[]> {
        return await this.permissionService.getAll();
    }

    @ApiOperation({summary: 'Получение разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Get('permission/:id')
    async getPermissionById(@Param('id') id: number): Promise<PermissionResponseDto> {
        return await this.permissionService.getByID(id);
    }

    @ApiOperation({summary: 'Получение разрешения по полю'})
    @ApiResponse({status: 200, type: Permission})
    @Get('category/:id')
    async getPermissionBy(@Body() requestParams: GetParamsData): Promise<PermissionResponseDto> {
        return await this.permissionService.getBy(requestParams);
    }

    @ApiOperation({summary: 'Обновление разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('permission/:id')
    async updatePermission(
        @Param('id') id: string,
        @Body() permissionRequestDto: PermissionRequestDto
    ): Promise<PermissionRequestDto> {
        return await this.permissionService.updatePermission(id, permissionRequestDto);
    }

    @ApiOperation({summary: 'Создание разрешения'})
    @ApiResponse({status: 201, type: Permission})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('permission')
    async createPermission(@Body() permissionRequestDto: PermissionRequestDto): Promise<any> {
        return await this.permissionService.createPermission(permissionRequestDto);
    }

    @ApiOperation({summary: 'Удаление разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('permission/:id')
    async deletePermission(@Param('id') id: number): Promise<any> {
        return await this.permissionService.delete(id);
    }
}
