import {
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes
  // HttpCode,
  // HttpStatus,
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles-auth.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { CategoryService } from './category.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryRequestDto } from './dto/category-request.dto';


@ApiTags('Категории')
@Controller('main')
export class CategoryController {
	constructor(private readonly service: CategoryService) {
	}

	@ApiOperation({summary: 'Получение списка категорий'})
	// @ApiResponse({status: 200, type: [User]})
  @UseInterceptors(ClassSerializerInterceptor)
	@Roles("ADMIN")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('bills')
  async getAll(): Promise<CategoryResponseDto[]> {
		return await this.service.getAll();
	}

	@ApiOperation({summary: 'Получение категории'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
  async getByID(@Param('id') id: number): Promise<CategoryResponseDto> {
		return await this.service.getByID(id);
	}

	@ApiOperation({summary: 'Получение категории по полю'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
  async getBy(@Query() requestDto: CategoryRequestDto): Promise<CategoryResponseDto> {
		return await this.service.getBy(requestDto);
	}

	@ApiOperation({summary: 'Обновление категории'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	// @UseGuards(JwtAuthGuard)
	@Patch('bill/:id')
  async update(
		@Body() requestDto: CategoryRequestDto,
		@Param() id: number,
	): Promise<CategoryResponseDto> {
		return await this.service.update(id, requestDto);
	}

	@ApiOperation({summary: 'Создание категории'})
	// @ApiResponse({status: 201, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	// @UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
  async create(@Body() requestDto: CategoryRequestDto): Promise<any> {
		return await this.service.create(requestDto);
	}

	@ApiOperation({summary: 'Удаление категории'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
  async delete(@Param('id') id: number): Promise<any> {
		return await this.service.delete(id);
	}
}
