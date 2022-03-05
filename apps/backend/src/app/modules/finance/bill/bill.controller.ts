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
import { BillService } from './bill.service';
import { BillRequestDto } from './dto/bill-request.dto';
import { BillResponseDto } from './dto/bill-response.dto';


@ApiTags('Счета')
@Controller('main')
export class BillController {
	constructor(private readonly service: BillService) {
	}

	@ApiOperation({summary: 'Получение списка пользователей'})
	// @ApiResponse({status: 200, type: [User]})
	@Roles("ADMIN")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('bills')
	getAll(): Promise<BillResponseDto[]> {
		return this.service.getAll();
	}

	@ApiOperation({summary: 'Получение пользователя'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
	getByID(@Param('id') id: number): Promise<BillResponseDto> {
		return this.service.getByID(id);
	}

	@ApiOperation({summary: 'Получение пользователя полю'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
	getBy(@Query() requestDto: BillRequestDto): Promise<BillResponseDto> {
		return this.service.getBy(requestDto);
	}

	@ApiOperation({summary: 'Обновление пользователя'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	@Patch('bill/:id')
	update(
		@Body() requestDto: BillRequestDto,
		@Param() id: number,
	): Promise<BillResponseDto> {
		return this.service.update(id, requestDto);
	}

	@ApiOperation({summary: 'Создание пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
	create(@Body() requestDto: BillRequestDto): Promise<any> {
		return this.service.create(requestDto);
	}

	@ApiOperation({summary: 'Удаление пользователя'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
	delete(@Param('id') id: number): Promise<any> {
		return this.service.delete(id);
	}
}
