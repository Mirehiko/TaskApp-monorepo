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
import { BillService } from './bill.service';
import { BillRequestDto, BillResponseDto } from '@finapp/app-common';
import { BillGetParamsData } from './interfaces/bill-params';


@ApiTags('Счета')
@Controller('main')
export class BillController {
	constructor(private readonly service: BillService) {
	}

	@ApiOperation({summary: 'Получение списка пользователей'})
	// @ApiResponse({status: 200, type: [User]})
  @UseInterceptors(ClassSerializerInterceptor)
	@Roles("ADMIN")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('bills')
  async getAll(): Promise<BillResponseDto[]> {
		// return await this.service.getAll();
    return [new BillResponseDto()];
	}

	@ApiOperation({summary: 'Получение пользователя'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
  async getByID(@Param('id') id: number): Promise<BillResponseDto> {
		// return await this.service.getByID(id);
    return new BillResponseDto();
	}

	@ApiOperation({summary: 'Получение пользователя полю'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
  async getBy(@Body() requestParams: BillGetParamsData): Promise<BillResponseDto> {
		// return await this.service.getBy(requestParams);
    return new BillResponseDto();
	}

	@ApiOperation({summary: 'Обновление пользователя'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
	@Patch('bill/:id')
	async update(
		@Body() requestDto: BillRequestDto,
		@Param() id: number,
	): Promise<BillResponseDto> {
	  return new BillResponseDto();
		// return await this.service.update(id, requestDto);
	}

	@ApiOperation({summary: 'Создание пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
  async create(@Body() requestDto: BillRequestDto): Promise<any> {
		return await this.service.create(requestDto);
	}

	@ApiOperation({summary: 'Удаление пользователя'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
  async delete(@Param('id') id: number): Promise<any> {
		return await this.service.delete(id);
	}
}
