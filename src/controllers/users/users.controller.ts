import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserRequestDto } from './user-request.dto';
import { ID } from '../../types/id.type';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return 'full list';
  }

  @Get(':id')
  getUser(@Param('id') id: ID) {
    return '' + id;
  }

  @Post()
  createUser(@Body() userRequestDto: UserRequestDto) {
    return userRequestDto;
  }

  @Patch(':id')
  updateUser(@Body() userRequestDto: UserRequestDto, @Param() id: ID) {
    return userRequestDto;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: ID) {
    return;
  }
}
