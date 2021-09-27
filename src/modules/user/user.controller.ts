import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, Res,
  // HttpCode,
  // HttpStatus,
} from '@nestjs/common';
import { UserRequestDto } from './dto/user-request.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./schemas/user.entity";
import {RoleRequestParams} from "../role/roleRequestParams";
import {RoleResponseDto} from "../role/dto/role-response.dto";
import {UserGetParams, UserRequestParams} from "./userRequestParams";
import { Req } from '@nestjs/common';

@ApiTags('Пользователи')
@Controller('/api/main/')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @ApiOperation({summary: 'Получение списка пользователей'})
  @ApiResponse({status: 200, type: [User]})
  @Get('users')
  getUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAll();
  }

  @ApiOperation({summary: 'Получение пользователя'})
  @ApiResponse({status: 200, type: User})
  @Get('user/:id')
  getUserById(@Param() userRequestParams: UserGetParams, @Res() response): Promise<UserResponseDto> {
    return this.userService.getById(userRequestParams, response);
  }

  @ApiOperation({summary: 'Получение пользователя полю'})
  @ApiResponse({status: 200, type: User})
  @Get('user/')
  getUserBy(@Query() userRequestParams: UserGetParams): Promise<UserResponseDto | any> {
    return this.userService.getUserBy(userRequestParams);
  }

  @ApiOperation({summary: 'Обновление пользователя'})
  @ApiResponse({status: 200, type: User})
  @Patch('user/:id')
  updateUser(
    @Body() userRequestDto: UserRequestDto,
    @Param() id: number,
    @Res() response
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, userRequestDto, response);
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 201, type: User})
  @Post('user')
  // @HttpCode(HttpStatus.CREATED)
  createUser(@Body() userRequestDto: UserRequestDto): Promise<any> {
    return this.userService.createUser(userRequestDto);
  }

  @ApiOperation({summary: 'Удаление пользователя'})
  @ApiResponse({status: 200, type: User})
  @Delete('user/:id')
  deleteUser(@Param('id') id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({summary: 'Назначение прав пользователю'})
  @ApiResponse({status: 201, type: User})
  @Post('userRoles')
  // @HttpCode(HttpStatus.CREATED)
  assignRolesToUser(@Param() id: number, roleResponseDto: RoleResponseDto[], @Res() response): Promise<any> {
    return this.userService.assignRolesToUser(id, roleResponseDto, response);
  }
}
