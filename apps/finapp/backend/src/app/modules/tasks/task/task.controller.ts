import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { UserRepository } from '../../common/user/user-repository';
import { plainToClass } from 'class-transformer';
import { RoleResponseDto, TaskRequestDto, TaskResponseDto, UserResponseDto } from '@finapp/app-common';
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
    const tasks = await this.service.getAll();
    return plainToClass(TaskResponseDto, tasks, { enableCircularCheck: true });
	}
	//
	// @ApiOperation({summary: 'Получение пользователя'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Get('operation/:id')
	// getUserById(@Param() userRequestParams: UserGetParams): Promise<CategoryResponseDto> {
	// 	return this.userService.getById(userRequestParams);
	// }
	//
	// @ApiOperation({summary: 'Получение пользователя полю'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Get('operation/')
	// getUserBy(@Query() userRequestParams: UserGetParams): Promise<CategoryResponseDto | any> {
	// 	return this.userService.getUserBy(userRequestParams);
	// }
	//
	// @ApiOperation({summary: 'Обновление пользователя'})
	// @ApiResponse({status: 200, type: User})
	// // @UseGuards(JwtAuthGuard)
	// @UseInterceptors(FileInterceptor('avatar'))
	// @Patch('operation/:id')
	// updateUser(
	// 	@Body() userRequestDto: CategoryRequestDto,
	// 	@Param() id: number,
	// 	@UploadedFile() avatar
	// ): Promise<CategoryResponseDto> {
	// 	return this.userService.updateUser(id, userRequestDto, avatar);
	// }
	//
  @ApiOperation({summary: 'Получение задачи'})
  @ApiResponse({status: 200, type: Role})
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('task/:id')
  async getTaskById(@Param('id') id: number): Promise<TaskResponseDto> {
    const task = await this.service.getByID(id);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
  }

	@ApiOperation({summary: 'Создание задачи'})
	@Post('task')
	async createTask(@Body() taskRequestDto: TaskRequestDto): Promise<TaskResponseDto> {
    const task = await this.service.create(taskRequestDto);
    return plainToClass(TaskResponseDto, task, { enableCircularCheck: true });
	}

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('task/:id')
  async deleteTask(@Param('id') id: number): Promise<any> {
    return await this.service.delete(id);
  }
}
