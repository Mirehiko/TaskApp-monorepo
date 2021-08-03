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
import { ID } from '../../shared/types/id.type';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  @Get('users')
  getUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAll();
  }

  @Get('user/:id')
  getUser(@Param('id') id: ID): Promise<UserResponseDto> {
    return this.userService.getById(id);
  }

  @Patch('user/:id')
  updateUser(
    @Body() userRequestDto: UserRequestDto,
    @Param() id: ID,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, userRequestDto);
  }

  @Post('user')
  // @HttpCode(HttpStatus.CREATED)
  createUser(@Body() userRequestDto: UserRequestDto, @Res() response): Promise<any> {
    return this.userService.createUser(userRequestDto, response);
  }

  @Delete('user/:id')
  deleteUser(@Param('id') id: ID): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
