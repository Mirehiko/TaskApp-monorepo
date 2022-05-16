import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { UserRepository } from '../../common/user/user-repository';
import { plainToClass } from 'class-transformer';
import {
  CategoryRequestDto, CategoryResponseDto,
  RoleResponseDto,
  TaskRequestDto,
  TaskResponseDto,
  UserResponseDto
} from '@finapp/app-common';
import { TransformInterceptor } from '../../../interceptors/transform.interceptor';
import { Role } from '../../common/role/schemas/role.entity';
import { Roles } from '../../common/auth/roles-auth.decorator';


@ApiTags('Задачи')
@Controller('main')
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

  @ApiOperation({summary: 'Получение задачи'})
  @ApiResponse({status: 200, type: Role})
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('task/:id')
  async getTaskTreeById(@Param('id') id: number): Promise<TaskResponseDto> {
    const task = await this.service.getTreeByID(id);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
  }

	@ApiOperation({summary: 'Создание задачи'})
	@Post('task')
	async createTask(@Body() taskRequestDto: TaskRequestDto): Promise<TaskResponseDto> {
    const task = await this.service.createTree(taskRequestDto);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
	}

  @ApiOperation({summary: 'Обновление категории'})
  @Patch('task/:id')
  async update(
    @Body() requestDto: TaskRequestDto,
    @Param() id: number,
  ): Promise<TaskResponseDto> {
    const task = await this.service.update(id, requestDto);
    return plainToClass(TaskResponseDto, task, { excludeExtraneousValues: true });
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('task/:id')
  async deleteTask(@Param('id') id: number): Promise<any> {
    return await this.service.delete(id);
  }
}
