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
import { OperationRequestDto } from './dto/operation-request.dto';
import { OperationResponseDto } from './dto/operation-response.dto';
import { OperationService } from './operation.service';


@ApiTags('Операции')
@Controller('/api/main/')
export class OperationController {
	constructor(private readonly service: OperationService) {
	}
	
	@ApiOperation({summary: 'Получение списка операций'})
	// @ApiResponse({status: 200, type: [User]})
	@Roles("ADMIN")
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('bills')
	getAll(): Promise<OperationResponseDto[]> {
		return this.service.getAll();
	}
	
	@ApiOperation({summary: 'Получение операции'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/:id')
	getByID(@Param('id') id: number): Promise<OperationResponseDto> {
		return this.service.getByID(id);
	}
	
	@ApiOperation({summary: 'Получение операции по полю'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Get('bill/')
	getBy(@Query() requestDto: OperationRequestDto): Promise<OperationResponseDto> {
		return this.service.getBy(requestDto);
	}
	
	@ApiOperation({summary: 'Обновление операции'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	@Patch('bill/:id')
	update(
		@Body() requestDto: OperationRequestDto,
		@Param() id: number,
	): Promise<OperationResponseDto> {
		return this.service.update(id, requestDto);
	}
	
	@ApiOperation({summary: 'Создание операции'})
	// @ApiResponse({status: 201, type: User})
	// @UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@Post('bill')
	// @HttpCode(HttpStatus.CREATED)
	create(@Body() requestDto: OperationRequestDto): Promise<any> {
		return this.service.create(requestDto);
	}
	
	@ApiOperation({summary: 'Удаление операции'})
	// @ApiResponse({status: 200, type: User})
	@UseGuards(JwtAuthGuard)
	@Delete('bill/:id')
	delete(@Param('id') id: number): Promise<any> {
		return this.service.delete(id);
	}
}
