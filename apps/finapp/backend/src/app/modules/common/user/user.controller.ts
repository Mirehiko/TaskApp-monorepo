import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes,
  // HttpCode,
  // HttpStatus,
} from '@nestjs/common';
import { UserGetParams, UserGetParamsData } from './interfaces/user-params';
import { UserService } from './user.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./schemas/user.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RolesGuard} from "../auth/roles.guard";
import { Roles } from '../auth/roles-auth.decorator';
import {ValidationPipe} from "../../../pipes/validation.pipe";
import {FileInterceptor} from "@nestjs/platform-express";
import { BanUserDto, RoleResponseDto, UserRequestDto, UserResponseDto, UserRolesDto } from '@finapp/app-common';


@ApiTags('Пользователи')
@Controller('main')
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @ApiOperation({summary: 'Получение списка пользователей'})
  @ApiResponse({status: 200, type: [UserResponseDto]})
  @Roles("ADMIN")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  async getUsers(): Promise<UserResponseDto[]> {
    return await this.service.getAll();
  }

  @ApiOperation({summary: 'Получение пользователя'})
  @ApiResponse({status: 200, type: UserResponseDto})
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: number): Promise<UserResponseDto> {
    return await this.service.getByID(id);
  }

  @ApiOperation({summary: 'Получение пользователя полю'})
  @ApiResponse({status: 200, type: UserResponseDto})
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('user/')
  async getUserBy(@Body() userRequestParams: UserGetParamsData): Promise<UserResponseDto> {
    return await this.service.getBy(userRequestParams);
  }

  @ApiOperation({summary: 'Обновление пользователя'})
  @ApiResponse({status: 200, type: UserResponseDto})
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('user/:id')
  async updateUser(
    @Body() requestDto: UserRequestDto,
    @Param() id: number,
    @UploadedFile() avatar
  ): Promise<UserResponseDto> {
    return await this.service.updateUser(id, requestDto, avatar);
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 201, type: UserResponseDto})
  // @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('user')
  // @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() requestDto: UserRequestDto): Promise<UserResponseDto> {
    return await this.service.createUser(requestDto);
  }

  @ApiOperation({summary: 'Удаление пользователя'})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  async deleteUser(@Param('id') id: number): Promise<any> {
    return await this.service.delete(id);
  }

  @ApiOperation({summary: 'Назначение прав пользователю'})
  @ApiResponse({status: 201})
  @UseGuards(JwtAuthGuard)
  @Post('user/assignRoles')
  async assignRolesToUser(@Body() userRolesDto: UserRolesDto): Promise<any> {
    return await this.service.assignRolesToUser(userRolesDto);
  }

  @ApiOperation({summary: 'Удаление прав пользователя'})
  @ApiResponse({status: 201})
  @UseGuards(JwtAuthGuard)
  @Post('user/removeUserRoles')
  async removeUserRoles(@Body() userRolesDto: UserRolesDto): Promise<any> {
    return await this.service.removeUserRoles(userRolesDto);
  }

  @ApiOperation({summary: 'Блокировка пользователя'})
  @ApiResponse({status: 201})
  @UseGuards(JwtAuthGuard)
  @Post('user/suspend')
  async suspend(@Body() banUserDto: BanUserDto): Promise<any> {
    return await this.service.suspend(banUserDto);
  }

  @ApiOperation({summary: 'Разблокировка пользователя'})
  @ApiResponse({status: 201})
  @UseGuards(JwtAuthGuard)
  @Post('user/unsuspend')
  async unsuspend(@Body() banUserDto: BanUserDto): Promise<any> {
    return await this.service.unsuspend(banUserDto);
  }
}
