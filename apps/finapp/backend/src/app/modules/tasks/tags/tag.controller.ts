import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { MoveDto, TagRequestDto, TagResponseDto } from '@finapp/app-common';
import { plainToClass } from 'class-transformer';
import { Role } from '../../common/role/schemas/role.entity';


@ApiTags('Теги')
@Controller('/api/main/')
export class TagController {
  constructor(private readonly service: TagService) {
  }

  @ApiOperation({summary: 'Получение списка задач'})
  @ApiResponse({status: 200, type: [TagResponseDto]})
  // @Roles("ADMIN")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('tags')
  async getTags(): Promise<TagResponseDto[]> {
    const tags = await this.service.getAllTrees();
    return plainToClass(TagResponseDto, tags, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Поиск задач'})
  @Get('tags/search')
  async searchTask(@Body() params): Promise<TagResponseDto[]> {
    const tags = await this.service.searchTagsBy(params);
    return plainToClass(TagResponseDto, tags, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Вернуть удаленные задачи'})
  @Get('tags/trash')
  async getTagsTrash(): Promise<TagResponseDto[]> {
    const tags = await this.service.getEntitiesTrash();
    return plainToClass(TagResponseDto, tags, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Получение задачи'})
  @ApiResponse({status: 200, type: Role})
  @Get('tag/:id')
  async getTagTreeById(@Param('id') id: number): Promise<TagResponseDto> {
    const task = await this.service.getTreeByID(id, ['createdBy']);
    return plainToClass(TagResponseDto, task, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Создание задачи/подзадачи'})
  @Post('tag')
  async createTag(@Body() taskRequestDto: TagRequestDto, @Req() req): Promise<TagResponseDto> {
    const task = await this.service.createTree(taskRequestDto, req.user);
    return plainToClass(TagResponseDto, task, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Перенос задач'})
  @Post('tag/move')
  async moveTags(@Body() moveDto: MoveDto, @Req() req): Promise<TagResponseDto[]> {
    await this.service.moveTo(moveDto, req.user);
    return await this.getTags();
  }

  @ApiOperation({summary: 'Обновление задачи'})
  @Patch('tag/:id')
  async update(@Body() requestDto: TagRequestDto, @Param() id: number, @Req() req): Promise<TagResponseDto> {
    const task = await this.service.update(id, requestDto, req.user);
    return plainToClass(TagResponseDto, task, { excludeExtraneousValues: true });
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tag/:id')
  async deleteTask(@Param('id') id: number): Promise<any> {
    return await this.service.delete([id]);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tags/trash')
  async moveTagsToTrash(@Body('taskIds') ids): Promise<any> {
    return await this.service.moveEntitiesToTrash(ids);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Post('tags/restore')
  async restoreTags(@Body('taskIds') ids): Promise<any> {
    return await this.service.restore(ids);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tag/:id/trash')
  async moveTagToTrash(@Param('id') id: number): Promise<any> {
    return await this.service.moveEntitiesToTrash([id]);
  }

  @ApiOperation({summary: 'Удаление задач'})
  @Delete('tags/delete')
  async tagsDelete(@Body('taskIds') ids): Promise<any> {
    return await this.service.delete(ids);
  }

  @ApiOperation({summary: 'Копирование задач'})
  @Post('tags/copy')
  async copyTags(@Body() body, @Req() req): Promise<TagResponseDto[]> {
    return await this.service.copyTree(body.id, body.tagIds, req.user);
  }
}
