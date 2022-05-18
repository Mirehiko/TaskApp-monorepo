import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post, Req, UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { plainToClass } from 'class-transformer';
import {
  MoveDto, TaskPriority,
  TaskRequestDto,
  TaskResponseDto, TaskStatus
} from '@finapp/app-common';
import { TransformInterceptor } from '../../../interceptors/transform.interceptor';
import { Role } from '../../common/role/schemas/role.entity';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';


@ApiTags('Задачи')
@Controller('main')
@UseGuards(JwtAuthGuard)
@UseInterceptors(new TransformInterceptor())
export class TaskController {
	constructor(
	  private readonly service: TaskService,
  ) {
	}
	//
	@ApiOperation({summary: 'Получение списка задач'})
	@ApiResponse({status: 200, type: [TaskResponseDto]})
	// @Roles("ADMIN")
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Get('tasks')
	async getTasks(): Promise<TaskResponseDto[]> {
    const tasks = await this.service.getAllTrees();
    return plainToClass(TaskResponseDto, tasks, { enableCircularCheck: true });
	}

  @ApiOperation({summary: 'Поиск задач'})
  @Get('tasks/search')
  async searchTask(@Body() params): Promise<TaskResponseDto[]> {
    const tasks = await this.service.searchTasksBy(params);
    return plainToClass(TaskResponseDto, tasks, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Вернуть удаленные задачи'})
  @Get('tasks/trash')
  async getTaskTrash(): Promise<TaskResponseDto[]> {
    const tasks = await this.service.getTaskTrash();
    return plainToClass(TaskResponseDto, tasks, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Получение задачи'})
  @ApiResponse({status: 200, type: Role})
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('task/:id')
  async getTaskTreeById(@Param('id') id: number): Promise<TaskResponseDto> {
    const task = await this.service.getTreeByID(id);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
  }

	@ApiOperation({summary: 'Создание задачи/подзадачи'})
	@Post('task')
	async createTask(@Body() taskRequestDto: TaskRequestDto, @Req() req): Promise<TaskResponseDto> {
    const task = await this.service.createTree(taskRequestDto, req.user);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
	}

  @ApiOperation({summary: 'Перенос задач'})
  @Post('task/move')
  async moveTasks(@Body() moveDto: MoveDto, @Req() req): Promise<TaskResponseDto[]> {
	  await this.service.moveTasksTo(moveDto, req.user);
	  return await this.getTasks();
  }

  @ApiOperation({summary: 'Назначить исполнителя для задачи'})
  @Post('task/:id/assign')
  async assignTaskTo(
    @Body('assigneeId') assigneeId: number, @Param() id: number, @Req() req): Promise<TaskResponseDto> {
    const task = await this.service.assignTaskTo(id, assigneeId, req.user);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Назначить проверяющего для задачи'})
  @Post('task/:id/reviewer')
  async setReviewer(
    @Body('reviewerId') reviewerId: number, @Param() id: number, @Req() req): Promise<TaskResponseDto> {
    const task = await this.service.setReviewer(id, reviewerId, req.user);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Обновление задачи'})
  @Patch('task/:id')
  async update(@Body() requestDto: TaskRequestDto, @Param() id: number, @Req() req): Promise<TaskResponseDto> {
    const task = await this.service.update(id, requestDto, req.user);
    return plainToClass(TaskResponseDto, task, { excludeExtraneousValues: true });
  }

  @ApiOperation({summary: 'Изменение статуса задачи'})
  @Post('task/:id/status')
  async setStatus(
    @Body('status') status: TaskStatus, @Param() id: number, @Req() req): Promise<TaskResponseDto> {
    const task = await this.service.setStatus(id, status, req.user);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Изменение приоритета задачи'})
  @Post('task/:id/priority')
  async setPriority( @Body('priority') priority: TaskPriority, @Param() id: number, @Req() req): Promise<void> {
    await this.service.setPriority(id, priority, req.user);
  }

  @ApiOperation({summary: 'Изменение времени задачи'})
  @Post('task/:id/dateDue')
  async setDateDue( @Body() body, @Param() id: number,
    @Req() req): Promise<TaskResponseDto> {
    const task = await this.service.setDateDue(id, { startDate: body.startDate, endDate: body.endDate }, req.user);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('task/:id')
  async deleteTask(@Param('id') id: number): Promise<any> {
    return await this.service.delete([id]);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tasks/trash')
  async moveTasksToTrash(@Body('taskIds') ids): Promise<any> {
    return await this.service.moveTasksToTrash(ids);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tasks/:id/trash')
  async moveTaskToTrash(@Param('id') id: number): Promise<any> {
    return await this.service.moveTasksToTrash([id]);
  }

  @ApiOperation({summary: 'Удаление задач'})
  @Delete('tasks/delete')
  async tasksDelete(@Body('taskIds') ids): Promise<any> {
    return await this.service.moveTasksToTrash(ids);
  }
}
