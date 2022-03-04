import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes,
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
@Controller('/api/main/')
export class CategoryController {
	constructor(private readonly service: CategoryService) {
	}
	
	@ApiOperation({summary: 'Получение списка категорий'})
	// @ApiResponse({status: 200, type: [User]})
	@Roles("ADMIN")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('bills')
	getAll(): Promise<CategoryResponseDto[]> {
		return this.service.getAll();
	}
	
	@ApiOperation({summary: 'Получение категории'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
	getByID(@Param('id') id: number): Promise<CategoryResponseDto> {
		return this.service.getByID(id);
	}
	
	@ApiOperation({summary: 'Получение категории по полю'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
	getBy(@Query() requestDto: CategoryRequestDto): Promise<CategoryResponseDto> {
		return this.service.getBy(requestDto);
	}
	
	@ApiOperation({summary: 'Обновление категории'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	@Patch('bill/:id')
	update(
		@Body() requestDto: CategoryRequestDto,
		@Param() id: number,
	): Promise<CategoryResponseDto> {
		return this.service.update(id, requestDto);
	}
	
	@ApiOperation({summary: 'Создание категории'})
	// @ApiResponse({status: 201, type: User})
	// @UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
	create(@Body() requestDto: CategoryRequestDto): Promise<any> {
		return this.service.create(requestDto);
	}
	
	@ApiOperation({summary: 'Удаление категории'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
	delete(@Param('id') id: number): Promise<any> {
		return this.service.delete(id);
	}
}
