import {
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, UseGuards, UseInterceptors
} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles-auth.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { OperationService } from './operation.service';
import { OperationRequestDto, OperationResponseDto } from '@finapp/app-common';
import { plainToClass } from 'class-transformer';
import { OperationGetParamsData } from './interfaces/operation-params';


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
    const operation = await this.service.getAll();
    return plainToClass(OperationResponseDto, operation, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Получение операции'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
  async getByID(@Param('id') id: number): Promise<OperationResponseDto> {
    const operation = await this.service.getByID(id);
    return plainToClass(OperationResponseDto, operation, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Получение операции по полю'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
  async getBy(@Query() requestDto: OperationGetParamsData): Promise<OperationResponseDto> {
    const operation = await this.service.getBy(requestDto);
    return plainToClass(OperationResponseDto, operation, { excludeExtraneousValues: true });
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
		const operation = await this.service.update(id, requestDto);
    return plainToClass(OperationResponseDto, operation, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Создание операции'})
	// @ApiResponse({status: 201, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	// @UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
  async create(@Body() requestDto: OperationRequestDto): Promise<OperationResponseDto> {
    const operation = await this.service.create(requestDto);
    return plainToClass(OperationResponseDto, operation, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Удаление операции'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
	async delete(@Param('id') id: number): Promise<any> {
		return await this.service.delete(id);
	}
}
