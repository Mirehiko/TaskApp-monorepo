import {
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, UseGuards, UseInterceptors,
} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles-auth.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { CategoryService } from './category.service';
import { CategoryRequestDto, CategoryResponseDto } from '@finapp/app-common';
import { BillGetParamsData } from '../bill/interfaces/bill-params';
import { plainToClass } from 'class-transformer';


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
    const category = await this.service.getAll();
    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Получение категории'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
  async getByID(@Param('id') id: number): Promise<CategoryResponseDto> {
    const category = await this.service.getByID(id);
    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Получение категории по полю'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
  async getBy(@Query() requestDto: BillGetParamsData): Promise<CategoryResponseDto> {
		const category = await this.service.getBy(requestDto);
    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
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
    const category = await this.service.update(id, requestDto);
    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Создание категории'})
	// @ApiResponse({status: 201, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	// @UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
  async create(@Body() requestDto: CategoryRequestDto): Promise<CategoryResponseDto> {
    const category = await this.service.create(requestDto);
    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Удаление категории'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
  async delete(@Param('id') id: number): Promise<any> {
		return await this.service.delete(id);
	}
}
