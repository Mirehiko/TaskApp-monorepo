import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post, Req, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import {
  TaskFilterRequestDto,
  TaskFilterResponseDto
} from '@taskapp/app-common';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { TaskFilterService } from './task-filter.service';
import { TransformInterceptor } from '../../../interceptors/transform.interceptor';


@ApiTags('Фильтры задач')
@Controller('main/tasks')
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
    const filters = await this.service.getAll(['metadata', 'metadata.createdBy', 'metadata.updatedBy',
      'metadata.assignee', 'metadata.reviewer', 'metadata.tags', 'metadata.list']);
    return plainToClass(TaskFilterResponseDto, filters, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Обновление задачи'})
  @Get('filter/:id')
  async getFilterById(@Param('id') id: number, @Req() req): Promise<TaskFilterResponseDto> {
    const filter = await this.service.getByID(id, ['metadata', 'metadata.createdBy', 'metadata.updatedBy',
      'metadata.assignee', 'metadata.reviewer', 'metadata.tags', 'metadata.list']);
    return plainToClass(TaskFilterResponseDto, filter, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Создание задачи/подзадачи'})
  @Post('filter')
  async createFilter(@Body() taskFilterRequestDto: TaskFilterRequestDto, @Req() req): Promise<TaskFilterResponseDto> {
    const filter = await this.service.createFilter(taskFilterRequestDto, req.user);
    return plainToClass(TaskFilterResponseDto, filter, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Обновление задачи'})
  @Patch('filter/:id')
  async update(@Body() taskFilterRequestDto: TaskFilterRequestDto, @Param('id') id: number, @Req() req): Promise<TaskFilterResponseDto> {
    const filter = await this.service.updateFilter(id, taskFilterRequestDto, req.user);
    return plainToClass(TaskFilterResponseDto, filter, { enableCircularCheck: true });
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
