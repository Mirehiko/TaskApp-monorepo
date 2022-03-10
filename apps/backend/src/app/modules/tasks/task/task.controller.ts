import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';


@ApiTags('Задачи')
@Controller('/api/main/')
export class TaskController {
	constructor(private readonly service: TaskService) {
	}
	//
	// @ApiOperation({summary: 'Получение списка пользователей'})
	// @ApiResponse({status: 200, type: [User]})
	// @Roles("ADMIN")
	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @Get('users')
	// getUsers(): Promise<CategoryResponseDto[]> {
	// 	return this.userService.getAll();
	// }
	//
	// @ApiOperation({summary: 'Получение пользователя'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Get('operation/:id')
	// getUserById(@Param() userRequestParams: UserGetParams): Promise<CategoryResponseDto> {
	// 	return this.userService.getById(userRequestParams);
	// }
	//
	// @ApiOperation({summary: 'Получение пользователя полю'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Get('operation/')
	// getUserBy(@Query() userRequestParams: UserGetParams): Promise<CategoryResponseDto | any> {
	// 	return this.userService.getUserBy(userRequestParams);
	// }
	//
	// @ApiOperation({summary: 'Обновление пользователя'})
	// @ApiResponse({status: 200, type: User})
	// // @UseGuards(JwtAuthGuard)
	// @UseInterceptors(FileInterceptor('avatar'))
	// @Patch('operation/:id')
	// updateUser(
	// 	@Body() userRequestDto: CategoryRequestDto,
	// 	@Param() id: number,
	// 	@UploadedFile() avatar
	// ): Promise<CategoryResponseDto> {
	// 	return this.userService.updateUser(id, userRequestDto, avatar);
	// }
	//
	// @ApiOperation({summary: 'Создание пользователя'})
	// @ApiResponse({status: 201, type: User})
	// // @UsePipes(ValidationPipe)
	// @UseGuards(JwtAuthGuard)
	// @Post('operation')
	// // @HttpCode(HttpStatus.CREATED)
	// createUser(@Body() userRequestDto: CategoryRequestDto): Promise<any> {
	// 	return this.userService.createUser(userRequestDto);
	// }
	//
	// @ApiOperation({summary: 'Удаление пользователя'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Delete('operation/:id')
	// deleteUser(@Param('id') id: number): Promise<any> {
	// 	return this.userService.deleteUser(id);
	// }
	//
	// @ApiOperation({summary: 'Назначение прав пользователю'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('operation/assignRoles')
	// assignRolesToUser(@Body() userRolesDto: UserRolesDto): Promise<any> {
	// 	return this.userService.assignRolesToUser(userRolesDto);
	// }
	//
	// @ApiOperation({summary: 'Удаление прав пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('operation/removeUserRoles')
	// removeUserRoles(@Body() userRolesDto: UserRolesDto): Promise<any> {
	// 	return this.userService.removeUserRoles(userRolesDto);
	// }
	//
	// @ApiOperation({summary: 'Блокировка пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('operation/suspend')
	// suspend(@Body() banUserDto: BanUserDto): Promise<any> {
	// 	return this.userService.suspend(banUserDto);
	// }
	//
	// @ApiOperation({summary: 'Разблокировка пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('operation/unsuspend')
	// unsuspend(@Body() banUserDto: BanUserDto): Promise<any> {
	// 	return this.userService.unsuspend(banUserDto);
	// }
}
