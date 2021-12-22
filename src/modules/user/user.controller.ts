import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, Res, UseGuards,
  // HttpCode,
  // HttpStatus,
} from '@nestjs/common';
import { UserRequestDto } from './dto/user-request.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./schemas/user.entity";
import {RoleResponseDto} from "../role/dto/role-response.dto";
import {UserGetParams, UserRequestParams} from "./userRequestParams";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RolesGuard} from "../auth/roles.guard";
import { Roles } from '../auth/roles-auth.decorator';

@ApiTags('Пользователи')
@Controller('/api/main/')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @ApiOperation({summary: 'Получение списка пользователей'})
  @ApiResponse({status: 200, type: [User]})
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  getUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAll();
  }

  @ApiOperation({summary: 'Получение пользователя'})
  @ApiResponse({status: 200, type: User})
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  getUserById(@Param() userRequestParams: UserGetParams): Promise<UserResponseDto> {
    return this.userService.getById(userRequestParams);
  }

  @ApiOperation({summary: 'Получение пользователя полю'})
  @ApiResponse({status: 200, type: User})
  @UseGuards(JwtAuthGuard)
  @Get('user/')
  getUserBy(@Query() userRequestParams: UserGetParams): Promise<UserResponseDto | any> {
    return this.userService.getUserBy(userRequestParams);
  }

  @ApiOperation({summary: 'Обновление пользователя'})
  @ApiResponse({status: 200, type: User})
  @UseGuards(JwtAuthGuard)
  @Patch('user/:id')
  updateUser(
    @Body() userRequestDto: UserRequestDto,
    @Param() id: number,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, userRequestDto);
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 201, type: User})
  @UseGuards(JwtAuthGuard)
  @Post('user')
  // @HttpCode(HttpStatus.CREATED)
  createUser(@Body() userRequestDto: UserRequestDto): Promise<any> {
    return this.userService.createUser(userRequestDto);
  }

  @ApiOperation({summary: 'Удаление пользователя'})
  @ApiResponse({status: 200, type: User})
  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  deleteUser(@Param('id') id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({summary: 'Назначение прав пользователю'})
  @ApiResponse({status: 201, type: User})
  @UseGuards(JwtAuthGuard)
  @Post('userRoles')
  // @HttpCode(HttpStatus.CREATED)
  assignRolesToUser(@Param() id: number, roleResponseDto: RoleResponseDto[]): Promise<any> {
    return this.userService.assignRolesToUser(id, roleResponseDto);
  }
}
