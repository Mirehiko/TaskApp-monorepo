import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Req, UseGuards
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CategoryRequestDto, CategoryResponseDto, MoveDto } from '@taskapp/app-common';
import { plainToClass } from 'class-transformer';
import { Role } from '../../common/role/schemas/role.entity';
import { Category } from './schemas/category.entity';


@ApiTags('Категории')
@Controller('main')
@UseGuards(JwtAuthGuard)
export class CategoryController {
	constructor(private readonly service: CategoryService) {
	}

	@ApiOperation({summary: 'Получение списка задач'})
	@ApiResponse({status: 200, type: [CategoryResponseDto]})
	// @Roles("ADMIN")
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Get('categories')
	async getCategories(): Promise<CategoryResponseDto[]> {
	  const categories = await this.service.getAllTrees(['createdBy']);
	  return plainToClass(CategoryResponseDto, categories, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Поиск задач'})
	@Get('categories/search')
	async searchCategory(@Body() params): Promise<CategoryResponseDto[]> {
	  const categories = await this.service.searchCategoriesBy(params);
	  return plainToClass(CategoryResponseDto, categories, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Вернуть удаленные задачи'})
	@Get('categories/trash')
	async getCategoriesTrash(): Promise<CategoryResponseDto[]> {
	  const categories = await this.service.getEntitiesTrash();
	  return plainToClass(CategoryResponseDto, categories, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Получение задачи'})
	@ApiResponse({status: 200, type: Role})
	@Get('category/:id')
	async getCategoryTreeById(@Param('id') id: number): Promise<CategoryResponseDto> {
	  const category = await this.service.getTreeByID(id, ['createdBy']);
	  return plainToClass(CategoryResponseDto, category, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Создание задачи/подзадачи'})
	@Post('category')
	async createCategory(@Body() categoryRequestDto: CategoryRequestDto, @Req() req): Promise<CategoryResponseDto> {
	  const category = await this.service.createTree(categoryRequestDto, req.user);
	  return plainToClass(CategoryResponseDto, category, { enableCircularCheck: true });
	}

	@ApiOperation({summary: 'Перенос задач'})
	@Post('categories/move')
	async moveCategories(@Body() moveDto: MoveDto, @Req() req): Promise<CategoryResponseDto[]> {
	  await this.service.moveTo(moveDto, req.userApiOperation);
	  return await this.getCategories();
	}

	@ApiOperation({summary: 'Обновление задачи'})
	@Patch('category/:id')
	async update(@Body() requestDto: CategoryRequestDto, @Param() id: number, @Req() req): Promise<CategoryResponseDto> {
	  const category = await this.service.update(id, requestDto, req.user);
	  return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Delete('category/:id')
	async deleteCategory(@Param('id') id: number): Promise<any> {
	  return await this.service.delete([id]);
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Delete('categories/trash')
	async moveCategoriesToTrash(@Body('categoryIds') ids): Promise<any> {
	  return await this.service.moveEntitiesToTrash(ids);
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Post('categories/restore')
	async restoreCategories(@Body('categoryIds') ids): Promise<any> {
	  return await this.service.restore(ids);
	}

	@ApiOperation({summary: 'Удаление задачи'})
	@Delete('category/:id/trash')
	async moveCategoryToTrash(@Param('id') id: number): Promise<any> {
	  return await this.service.moveEntitiesToTrash([id]);
	}

	@ApiOperation({summary: 'Удаление задач'})
	@Delete('categories/delete')
	async categoriesDelete(@Body('categoryIds') ids): Promise<any> {
	  return await this.service.delete(ids);
	}

	@ApiOperation({summary: 'Копирование задач'})
	@Post('categories/copy')
	async copyCategories(@Body() body, @Req() req): Promise<CategoryResponseDto[]> {
	  const categories = await this.service.copyTree(body.id, body.categoryIds, Category, req.user);
	  return plainToClass(CategoryResponseDto, categories, { excludeExtraneousValues: true });
	}
}
