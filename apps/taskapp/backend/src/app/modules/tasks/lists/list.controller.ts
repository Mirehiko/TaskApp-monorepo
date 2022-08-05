import { ListResponseDto, ListRequestDto, MoveDto } from '@taskapp/app-common';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Role } from '../../common/role/schemas/role.entity';
import { ListService } from './list.service';
import { List } from './schemas/list.entity';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';


@ApiTags('Папки')
@Controller('main')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly service: ListService) {
  }

	@ApiOperation({summary: 'Получение списка задач'})
	@ApiResponse({status: 200, type: [ListResponseDto]})
	// @Roles("ADMIN")
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Get('lists')
	async getLists(): Promise<ListResponseDto[]> {
	  const lists = await this.service.getAll(['createdBy']);
	  return plainToClass(ListResponseDto, lists, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Поиск задач'})
	@Get('lists/search')
	async searchList(@Body() params): Promise<ListResponseDto[]> {
	  const lists = await this.service.searchListsBy(params);
	  return plainToClass(ListResponseDto, lists, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Вернуть удаленные задачи'})
	@Get('lists/trash')
	async getListsTrash(): Promise<ListResponseDto[]> {
	  const lists = await this.service.getEntitiesTrash();
	  return plainToClass(ListResponseDto, lists, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Получение задачи'})
	@ApiResponse({status: 200, type: Role})
	@Get('list/:id')
	async getListById(@Param('id') id: number): Promise<ListResponseDto> {
	  const list = await this.service.getByID(id, ['createdBy', 'tasks', 'tasks.tags', 'tasks.reviewer', 'tasks.assignee']);
	  return plainToClass(ListResponseDto, list, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Создание задачи/подзадачи'})
	@Post('list')
	async createList(@Body() listRequestDto: ListRequestDto, @Req() req): Promise<ListResponseDto> {
	  const list = await this.service.create(listRequestDto, req.user);
	  return plainToClass(ListResponseDto, list, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Перенос задач'})
	@Post('lists/move')
	async moveLists(@Body() moveDto: MoveDto, @Req() req): Promise<ListResponseDto[]> {
	  await this.service.moveTo(moveDto, req.userApiOperation);
	  return await this.getLists();
	}

	@ApiOperation({summary: 'Обновление задачи'})
	@Patch('list/:id')
	async update(@Body() requestDto: ListRequestDto, @Param() id: number, @Req() req): Promise<ListResponseDto> {
	  const list = await this.service.update(id, requestDto, req.user);
	  return plainToClass(ListResponseDto, list, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Delete('list/:id')
	async deleteList(@Param('id') id: number): Promise<any> {
	  return await this.service.delete([id]);
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Delete('lists/trash')
	async moveListsToTrash(@Body('listIds') ids): Promise<any> {
	  return await this.service.moveEntitiesToTrash(ids);
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Post('lists/restore')
	async restoreLists(@Body('listIds') ids): Promise<any> {
	  return await this.service.restore(ids);
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Delete('list/:id/trash')
	async moveListToTrash(@Param('id') id: number): Promise<any> {
	  return await this.service.moveEntitiesToTrash([id]);
	}

	@ApiOperation({summary: 'Удаление задач'})
	@Delete('lists/delete')
	async listsDelete(@Body('listIds') ids): Promise<any> {
	  return await this.service.delete(ids);
	}

	@ApiOperation({summary: 'Копирование задач'})
	@Post('lists/copy')
	async copyLists(@Body('id') id, @Req() req): Promise<ListResponseDto> {
	  const lists = await this.service.duplicate(id, List, req.user);
	  return plainToClass(ListResponseDto, lists, { excludeExtraneousValues: true });
	}
}
