import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { MoveDto, TagRequestDto, TagResponseDto } from '@taskapp/app-common';
import { plainToClass } from 'class-transformer';
import { Role } from '../../common/role/schemas/role.entity';
import { Tag } from './schemas/tag.entity';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';


@ApiTags('Теги')
@Controller('main')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly service: TagService) {
  }

  @ApiOperation({summary: 'Получение списка задач'})
  @ApiResponse({status: 200, type: [TagResponseDto]})
  // @Roles("ADMIN")
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('tags')
  async getTags(): Promise<TagResponseDto[]> {
    const tags = await this.service.getAllTrees(['createdBy']);
    return plainToClass(TagResponseDto, tags, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Поиск задач'})
  @Get('tags/search')
  async searchTag(@Body() params): Promise<TagResponseDto[]> {
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
  async getTagById(@Param('id') id: number): Promise<TagResponseDto> {
    const tag = await this.service.getByID(id, ['createdBy', 'tasks', 'tasks.list', 'tasks.reviewer', 'tasks.assignee']);
    return plainToClass(TagResponseDto, tag, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Создание задачи/подзадачи'})
  @Post('tag')
  async createTag(@Body() tagRequestDto: TagRequestDto, @Req() req): Promise<TagResponseDto> {
    const tag = await this.service.createTree(tagRequestDto, req.user);
    return plainToClass(TagResponseDto, tag, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Перенос задач'})
  @Post('tags/move')
  async moveTags(@Body() moveDto: MoveDto, @Req() req): Promise<TagResponseDto[]> {
    await this.service.moveTo(moveDto, req.userApiOperation);
    return await this.getTags();
  }

  @ApiOperation({summary: 'Обновление задачи'})
  @Patch('tag/:id')
  async update(@Body() requestDto: TagRequestDto, @Param() id: number, @Req() req): Promise<TagResponseDto> {
    const tag = await this.service.update(id, requestDto, req.user);
    return plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true });
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tag/:id')
  async deleteTag(@Param('id') id: number): Promise<any> {
    return await this.service.delete([id]);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tags/trash')
  async moveTagsToTrash(@Body('tagIds') ids): Promise<any> {
    return await this.service.moveEntitiesToTrash(ids);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Post('tags/restore')
  async restoreTags(@Body('tagIds') ids): Promise<any> {
    return await this.service.restore(ids);
  }

  @ApiOperation({summary: 'Удаление задачи'})
  @Delete('tag/:id/trash')
  async moveTagToTrash(@Param('id') id: number): Promise<any> {
    return await this.service.moveEntitiesToTrash([id]);
  }

  @ApiOperation({summary: 'Удаление задач'})
  @Delete('tags/delete')
  async tagsDelete(@Body('tagIds') ids): Promise<any> {
    return await this.service.delete(ids);
  }

  @ApiOperation({summary: 'Копирование задач'})
  @Post('tags/copy')
  async copyTags(@Body() body, @Req() req): Promise<TagResponseDto[]> {
    const tags = await this.service.copyTree(body.id, body.tagIds, Tag, req.user);
    return plainToClass(TagResponseDto, tags, { excludeExtraneousValues: true });
  }
}
