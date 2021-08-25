import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Res,
  // HttpCode,
  // HttpStatus,
} from '@nestjs/common';
import { UserRequestDto } from './dto/user-request.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./schemas/user.entity";

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
  getUser(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userService.getById(id);
  }

  @ApiOperation({summary: 'Обновление пользователя'})
  @ApiResponse({status: 200, type: User})
  @Patch('user/:id')
  updateUser(
    @Body() userRequestDto: UserRequestDto,
    @Param() id: number,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, userRequestDto);
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 201, type: User})
  @Post('user')
  // @HttpCode(HttpStatus.CREATED)
  createUser(@Body() userRequestDto: UserRequestDto, @Res() response): Promise<any> {
    return this.userService.createUser(userRequestDto, response);
  }

  @ApiOperation({summary: 'Удаление пользователя'})
  @ApiResponse({status: 200, type: User})
  @Delete('user/:id')
  deleteUser(@Param('id') id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
