import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes,
  // HttpCode,
  // HttpStatus,
} from '@nestjs/common';
import { UserRequestDto } from './dto/user-request.dto';
import { UserGetParams, UserGetParamsData } from './interfaces/user-params';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./schemas/user.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RolesGuard} from "../auth/roles.guard";
import { Roles } from '../auth/roles-auth.decorator';
import {UserRolesDto} from "./dto/assign-roles.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {ValidationPipe} from "../../../pipes/validation.pipe";
import {FileInterceptor} from "@nestjs/platform-express";

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
  getUserById(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userService.getByID(id);
  }

  @ApiOperation({summary: 'Получение пользователя полю'})
  @ApiResponse({status: 200, type: User})
  @UseGuards(JwtAuthGuard)
  @Get('user/')
  getUserBy(@Query() userRequestParams: UserGetParamsData): Promise<UserResponseDto> {
    return this.userService.getBy(userRequestParams);
  }

  @ApiOperation({summary: 'Обновление пользователя'})
  @ApiResponse({status: 200, type: User})
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('user/:id')
  updateUser(
    @Body() userRequestDto: UserRequestDto,
    @Param() id: number,
    @UploadedFile() avatar
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, userRequestDto, avatar);
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 201, type: User})
  // @UsePipes(ValidationPipe)
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
    return this.userService.delete(id);
  }

  @ApiOperation({summary: 'Назначение прав пользователю'})
  @ApiResponse({status: 201, type: User})
  @UseGuards(JwtAuthGuard)
  @Post('user/assignRoles')
  assignRolesToUser(@Body() userRolesDto: UserRolesDto): Promise<any> {
    return this.userService.assignRolesToUser(userRolesDto);
  }

  @ApiOperation({summary: 'Удаление прав пользователя'})
  @ApiResponse({status: 201, type: User})
  @UseGuards(JwtAuthGuard)
  @Post('user/removeUserRoles')
  removeUserRoles(@Body() userRolesDto: UserRolesDto): Promise<any> {
    return this.userService.removeUserRoles(userRolesDto);
  }

  @ApiOperation({summary: 'Блокировка пользователя'})
  @ApiResponse({status: 201, type: User})
  @UseGuards(JwtAuthGuard)
  @Post('user/suspend')
  suspend(@Body() banUserDto: BanUserDto): Promise<any> {
    return this.userService.suspend(banUserDto);
  }

  @ApiOperation({summary: 'Разблокировка пользователя'})
  @ApiResponse({status: 201, type: User})
  @UseGuards(JwtAuthGuard)
  @Post('user/unsuspend')
  unsuspend(@Body() banUserDto: BanUserDto): Promise<any> {
    return this.userService.unsuspend(banUserDto);
  }
}
