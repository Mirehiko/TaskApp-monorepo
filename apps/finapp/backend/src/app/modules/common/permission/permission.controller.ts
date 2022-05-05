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
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { GetParamsData } from '../../base-service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {PermissionService} from "./permission.service";
import {Permission} from "./schemas/permission.entity";
import { PermissionRequestDto, PermissionResponseDto, UserResponseDto } from '@finapp/app-common';
import { plainToClass } from 'class-transformer';
import { TransformInterceptor } from '../../../interceptors/transform.interceptor';


// TODO: Add auth guard after migrations release
@ApiTags('Разрешения')
@Controller('main')
@UseInterceptors(new TransformInterceptor())
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @ApiOperation({summary: 'Получение списка разрешений'})
  @ApiResponse({status: 200, type: [Permission]})
  @Get('permissions')
  async getPermissions(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionService.getAll();
    return plainToClass(PermissionResponseDto, permissions, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Получение разрешения'})
  @ApiResponse({status: 200, type: Permission})
  @Get('permission/:id')
  async getPermissionById(@Param('id') id: number): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.getByID(id);
    return plainToClass(PermissionResponseDto, permission, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Получение разрешения по полю'})
  @ApiResponse({status: 200, type: Permission})
  @Get('category/:id')
  async getPermissionBy(@Body() requestParams: GetParamsData): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.getBy(requestParams);
    return plainToClass(PermissionResponseDto, permission, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Обновление разрешения'})
  @ApiResponse({status: 200, type: Permission})
  @Roles("ADMIN")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('permission/:id')
  async updatePermission(
    @Param('id') id: string,
    @Body() permissionRequestDto: PermissionRequestDto
  ): Promise<PermissionRequestDto> {
    const permission = await this.permissionService.updatePermission(id, permissionRequestDto);
    return plainToClass(PermissionResponseDto, permission, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Создание разрешения'})
  @ApiResponse({status: 201, type: Permission})
  @Roles("ADMIN")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('permission')
  async createPermission(@Body() permissionRequestDto: PermissionRequestDto): Promise<any> {
    const permission = this.permissionService.createPermission(permissionRequestDto);
    return plainToClass(PermissionResponseDto, permission, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Удаление разрешения'})
  @ApiResponse({status: 200, type: Permission})
  @Roles("ADMIN")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('permission/:id')
  async deletePermission(@Param('id') id: number): Promise<any> {
    return await this.permissionService.delete(id);
  }
}
