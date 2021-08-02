import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // HttpCode,
  // HttpStatus,
} from '@nestjs/common';
import { UserRequestDto } from './dto/user-request.dto';
import { ID } from '../../types/id.type';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  @Get()
  getUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') id: ID): Promise<UserResponseDto> {
    return this.userService.getById(id);
  }

  @Post()
  // @HttpCode(HttpStatus.CREATED)
  createUser(@Body() userRequestDto: UserRequestDto): Promise<any> {
    return this.userService.createUser(userRequestDto);
  }

  @Patch(':id')
  updateUser(
    @Body() userRequestDto: UserRequestDto,
    @Param() id: ID,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, userRequestDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: ID): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
