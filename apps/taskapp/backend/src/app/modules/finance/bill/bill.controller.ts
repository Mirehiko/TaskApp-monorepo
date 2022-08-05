import {
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, UseGuards, UseInterceptors
} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles-auth.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { BillService } from './bill.service';
import { BillRequestDto, BillResponseDto, CategoryResponseDto, IBillGetParamsData } from '@taskapp/app-common';
import { plainToClass } from 'class-transformer';


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
    const bill = await this.service.getAll(['createdBy', 'createdBy.users']);
    return plainToClass(BillResponseDto, bill, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Получение пользователя'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
  async getByID(@Param('id') id: number): Promise<BillResponseDto> {
    const bill = await this.service.getByID(id, ['createdBy', 'createdBy.users']);
    return plainToClass(BillResponseDto, bill, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Получение пользователя полю'})
	// @ApiResponse({status: 200, type: User})
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
  async getBy(@Body() requestParams: IBillGetParamsData): Promise<BillResponseDto> {
    const bill = await this.service.getBy(requestParams, ['createdBy', 'createdBy.users']);
    return plainToClass(BillResponseDto, bill, { excludeExtraneousValues: true });
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
    const bill = await this.service.update(id, requestDto);
    return plainToClass(BillResponseDto, bill, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Создание пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
  async create(@Body() requestDto: BillRequestDto): Promise<any> {
    const bill = await this.service.create(requestDto);
    return plainToClass(BillResponseDto, bill, { excludeExtraneousValues: true });
	}

	@ApiOperation({summary: 'Удаление пользователя'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
  async delete(@Param('id') id: number): Promise<any> {
		return await this.service.delete([id]);
	}
}
