import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { GetParamsData } from '../../base-service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RoleResponseDto } from '../role/dto/role-response.dto';
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
    
    @ApiOperation({summary: 'Получение разрешения по полю'})
    @ApiResponse({status: 200, type: Permission})
    @Get('role/:id')
    getPermissionBy(@Query() requestParams: GetParamsData): Promise<PermissionResponseDto> {
        return this.permissionService.getBy(requestParams);
    }
    
    @ApiOperation({summary: 'Обновление разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('permission/:id')
    updatePermission(
        @Param('id') id: string,
        @Body() permissionRequestDto: PermissionRequestDto
    ): Promise<PermissionRequestDto> {
        return this.permissionService.updatePermission(id, permissionRequestDto);
    }

    @ApiOperation({summary: 'Создание разрешения'})
    @ApiResponse({status: 201, type: Permission})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('permission')
    createPermission(@Body() permissionRequestDto: PermissionRequestDto): Promise<any> {
        return this.permissionService.createPermission(permissionRequestDto);
    }

    @ApiOperation({summary: 'Удаление разрешения'})
    @ApiResponse({status: 200, type: Permission})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('permission/:id')
    deletePermission(@Param('id') id: number): Promise<any> {
        return this.permissionService.delete(id);
    }
}
