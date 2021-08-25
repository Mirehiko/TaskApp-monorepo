import {Body, Controller, Delete, Get, Param, Patch, Post, Res} from '@nestjs/common';
import {RoleService} from "./role.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RoleRequestDto} from "./dto/role-request.dto";
import {RoleResponseDto} from "./dto/role-response.dto";
import { Role } from './schemas/role.entity';

@ApiTags('Роли')
@Controller('/api/main/')
export class RoleController {
    constructor(private readonly roleService: RoleService) {
    }

    @ApiOperation({summary: 'Получение списка ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @Get('roles')
    getRoles(): Promise<RoleResponseDto[]> {
        return this.roleService.getAll();
    }


    @ApiOperation({summary: 'Получение роли'})
    @ApiResponse({status: 200, type: Role})
    @Get('role/:id')
    getRoleById(@Param('id') id: string, @Res() response): Promise<RoleResponseDto> {
        return this.roleService.getByID(id, response);
    }

    // @ApiOperation({summary: 'Получение роли'})
    // @ApiResponse({status: 200, type: Role})
    // @Get('role/:id')
    // getRoleBy(@Param() params: any, @Res() response): Promise<RoleResponseDto> {
    //     return this.roleService.getBy(params, response);
    // }

    @ApiOperation({summary: 'Обновление роли'})
    @ApiResponse({status: 200, type: Role})
    @Patch('role/:id')
    updateRole(
        @Param('id') id: string,
        @Body() roleRequestDto: RoleRequestDto,
        @Res() response
    ): Promise<RoleRequestDto> {
        return this.roleService.updateRole(id, roleRequestDto, response);
    }

    @ApiOperation({summary: 'Создание роли'})
    @ApiResponse({status: 201, type: Role})
    @Post('role')
    createRole(@Body() roleRequestDto: RoleRequestDto, @Res() response): Promise<any> {
        return this.roleService.createRole(roleRequestDto, response);
    }

    @ApiOperation({summary: 'Удаление роли'})
    @ApiResponse({status: 200, type: Role})
    @Delete('role/:id')
    deleteRole(@Param('id') id: string, @Res() response): Promise<any> {
        return this.roleService.deleteRole(id, response);
    }
}
