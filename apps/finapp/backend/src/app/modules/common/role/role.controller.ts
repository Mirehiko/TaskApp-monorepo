import {
  Body, ClassSerializerInterceptor,
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
import {RoleService} from "./role.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { Role } from './schemas/role.entity';
import {TransformInterceptor} from "../../../interceptors/transform.interceptor";
import { RoleRequestDto, RoleResponseDto } from '@finapp/app-common';
import { plainToClass } from 'class-transformer';


@ApiTags('Роли')
@Controller('main')
@UseInterceptors(new TransformInterceptor())
export class RoleController {
    constructor(private readonly service: RoleService) {
    }

    @ApiOperation({summary: 'Получение списка ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @Get('roles')
    async getRoles(): Promise<RoleResponseDto[]> {
      const roles = await this.service.getAll();
      return plainToClass(RoleResponseDto, roles, { excludeExtraneousValues: true });
    }


    @ApiOperation({summary: 'Получение роли'})
    @ApiResponse({status: 200, type: Role})
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('role/:id')
    async getRoleById(@Param('id') id: number): Promise<RoleResponseDto> {
      return await this.service.getByID(id);
    }

    @ApiOperation({summary: 'Получение роли'})
    @ApiResponse({status: 200, type: Role})
    @Get('role/:id')
    async getRoleBy(@Query() requestParams: GetParamsData): Promise<RoleResponseDto> {
      const role = await this.service.getBy(requestParams);
      return plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true });
    }

    @ApiOperation({summary: 'Обновление роли'})
    @ApiResponse({status: 200, type: Role})
    @UseInterceptors(ClassSerializerInterceptor)
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('role/:id')
    async updateRole(
        @Param('id') id: number,
        @Body() roleRequestDto: RoleRequestDto,
    ): Promise<RoleResponseDto> {
      return await this.service.updateRole(id, roleRequestDto);
    }

    @ApiOperation({summary: 'Создание роли'})
    @ApiResponse({status: 201, type: Role})
    @UseInterceptors(ClassSerializerInterceptor)
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('role')
    async createRole(@Body() roleRequestDto: RoleRequestDto): Promise<any> {
      return await this.service.createRole(roleRequestDto);
    }

    @ApiOperation({summary: 'Удаление роли'})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('role/:id')
    async deleteRole(@Param('id') id: number): Promise<any> {
        return await this.service.delete(id);
    }
}
