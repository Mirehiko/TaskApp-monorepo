import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post, Req, UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import {
  TaskFilterRequestDto,
  TaskFilterResponseDto
} from '@finapp/app-common';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { TaskFilterService } from './task-filter.service';


@ApiTags('Комментарии')
@Controller('main/tasks/')
@UseGuards(JwtAuthGuard)
// @UseInterceptors(new TransformInterceptor())
export class TaskFilterController {
  constructor(
    private readonly service: TaskFilterService,
  ) {
  }

  @ApiOperation({summary: 'Получение списка комментариев'})
  @ApiResponse({status: 200, type: [TaskFilterResponseDto]})
  @Get('filters')
  async getFilters(): Promise<TaskFilterResponseDto[]> {
    const comments = await this.service.getAll();
    return plainToClass(TaskFilterResponseDto, comments, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Создание задачи/подзадачи'})
  @Post('filter/:id')
  async createFilter(@Body() taskFilterRequestDto: TaskFilterRequestDto, @Req() req): Promise<TaskFilterResponseDto> {
    const comment = await this.service.createFilter(taskFilterRequestDto, req.user);
    return plainToClass(TaskFilterResponseDto, comment, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Обновление задачи'})
  @Patch('filter/:id')
  async update(@Body() taskFilterRequestDto: TaskFilterRequestDto, @Param('id') id: number, @Req() req): Promise<TaskFilterResponseDto> {
    const comment = await this.service.updateFilter(id, taskFilterRequestDto, req.user);
    return plainToClass(TaskFilterResponseDto, comment, { enableCircularCheck: true, enableImplicitConversion: true });
  }

  @ApiOperation({summary: 'Удаление комментария'})
  @Delete('filter/:id')
  async deleteFilter(@Param('id') id: number): Promise<any> {
    return await this.service.delete([id]);
  }

  @ApiOperation({summary: 'Удаление задач'})
  @Delete('filters')
  async deleteFilters(@Body('filterIds') ids): Promise<any> {
    return await this.service.delete(ids);
  }
}
