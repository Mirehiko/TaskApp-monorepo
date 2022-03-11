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
import { OperationRequestDto } from './dto/operation-request.dto';
import { OperationResponseDto } from './dto/operation-response.dto';
import { OperationService } from './operation.service';


@ApiTags('Операции')
@Controller('main')
export class OperationController {
	constructor(private readonly service: OperationService) {
	}

	@ApiOperation({summary: 'Получение списка операций'})
	// @ApiResponse({status: 200, type: [User]})
  @UseInterceptors(ClassSerializerInterceptor)
	@Roles("ADMIN")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('bills')
  async getAll(): Promise<OperationResponseDto[]> {
		return await this.service.getAll();
	}

	@ApiOperation({summary: 'Получение операции'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
  async getByID(@Param('id') id: number): Promise<OperationResponseDto> {
		return await this.service.getByID(id);
	}

	@ApiOperation({summary: 'Получение операции по полю'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
  async getBy(@Query() requestDto: OperationRequestDto): Promise<OperationResponseDto> {
		return await this.service.getBy(requestDto);
	}

	@ApiOperation({summary: 'Обновление операции'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	// @UseGuards(JwtAuthGuard)
	@Patch('bill/:id')
  async update(
		@Body() requestDto: OperationRequestDto,
		@Param() id: number,
	): Promise<OperationResponseDto> {
		return await this.service.update(id, requestDto);
	}

	@ApiOperation({summary: 'Создание операции'})
	// @ApiResponse({status: 201, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	// @UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
  async create(@Body() requestDto: OperationRequestDto): Promise<any> {
		return await this.service.create(requestDto);
	}

	@ApiOperation({summary: 'Удаление операции'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
	async delete(@Param('id') id: number): Promise<any> {
		return await this.service.delete(id);
	}
}