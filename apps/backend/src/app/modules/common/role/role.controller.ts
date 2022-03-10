import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { GetParamsData } from '../../base-service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserGetParamsData } from '../user/interfaces/user-params';
import {RoleService} from "./role.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RoleRequestDto} from "./dto/role-request.dto";
import {RoleResponseDto} from "./dto/role-response.dto";
import { Role } from './schemas/role.entity';
import {RoleRequestParams} from "./roleRequestParams";
import {TransformInterceptor} from "../../../interceptors/transform.interceptor";

@ApiTags('Роли')
@Controller('main')
@UseInterceptors(new TransformInterceptor())
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
    @Get('category/:id')
    getRoleById(@Param('id') id: number): Promise<RoleResponseDto> {
        return this.roleService.getByID(id);
    }

    @ApiOperation({summary: 'Получение роли'})
    @ApiResponse({status: 200, type: Role})
    @Get('category/:id')
    getRoleBy(@Query() requestParams: GetParamsData): Promise<RoleResponseDto> {
        return this.roleService.getBy(requestParams);
    }

    @ApiOperation({summary: 'Обновление роли'})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('category/:id')
    updateRole(
        @Param('id') id: number,
        @Body() roleRequestDto: RoleRequestDto,
    ): Promise<RoleRequestDto> {
        return this.roleService.updateRole(id, roleRequestDto);
    }

    @ApiOperation({summary: 'Создание роли'})
    @ApiResponse({status: 201, type: Role})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('role')
    createRole(@Body() roleRequestDto: RoleRequestDto): Promise<any> {
        return this.roleService.createRole(roleRequestDto);
    }

    @ApiOperation({summary: 'Удаление роли'})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('category/:id')
    deleteRole(@Param('id') id: number): Promise<any> {
        return this.roleService.delete(id);
    }
}
