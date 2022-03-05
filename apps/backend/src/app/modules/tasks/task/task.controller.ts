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
	// getUsers(): Promise<UserResponseDto[]> {
	// 	return this.userService.getAll();
	// }
	//
	// @ApiOperation({summary: 'Получение пользователя'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Get('user/:id')
	// getUserById(@Param() userRequestParams: UserGetParams): Promise<UserResponseDto> {
	// 	return this.userService.getById(userRequestParams);
	// }
	//
	// @ApiOperation({summary: 'Получение пользователя полю'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Get('user/')
	// getUserBy(@Query() userRequestParams: UserGetParams): Promise<UserResponseDto | any> {
	// 	return this.userService.getUserBy(userRequestParams);
	// }
	//
	// @ApiOperation({summary: 'Обновление пользователя'})
	// @ApiResponse({status: 200, type: User})
	// // @UseGuards(JwtAuthGuard)
	// @UseInterceptors(FileInterceptor('avatar'))
	// @Patch('user/:id')
	// updateUser(
	// 	@Body() userRequestDto: UserRequestDto,
	// 	@Param() id: number,
	// 	@UploadedFile() avatar
	// ): Promise<UserResponseDto> {
	// 	return this.userService.updateUser(id, userRequestDto, avatar);
	// }
	//
	// @ApiOperation({summary: 'Создание пользователя'})
	// @ApiResponse({status: 201, type: User})
	// // @UsePipes(ValidationPipe)
	// @UseGuards(JwtAuthGuard)
	// @Post('user')
	// // @HttpCode(HttpStatus.CREATED)
	// createUser(@Body() userRequestDto: UserRequestDto): Promise<any> {
	// 	return this.userService.createUser(userRequestDto);
	// }
	//
	// @ApiOperation({summary: 'Удаление пользователя'})
	// @ApiResponse({status: 200, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Delete('user/:id')
	// deleteUser(@Param('id') id: number): Promise<any> {
	// 	return this.userService.deleteUser(id);
	// }
	//
	// @ApiOperation({summary: 'Назначение прав пользователю'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('user/assignRoles')
	// assignRolesToUser(@Body() userRolesDto: UserRolesDto): Promise<any> {
	// 	return this.userService.assignRolesToUser(userRolesDto);
	// }
	//
	// @ApiOperation({summary: 'Удаление прав пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('user/removeUserRoles')
	// removeUserRoles(@Body() userRolesDto: UserRolesDto): Promise<any> {
	// 	return this.userService.removeUserRoles(userRolesDto);
	// }
	//
	// @ApiOperation({summary: 'Блокировка пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('user/suspend')
	// suspend(@Body() banUserDto: BanUserDto): Promise<any> {
	// 	return this.userService.suspend(banUserDto);
	// }
	//
	// @ApiOperation({summary: 'Разблокировка пользователя'})
	// @ApiResponse({status: 201, type: User})
	// @UseGuards(JwtAuthGuard)
	// @Post('user/unsuspend')
	// unsuspend(@Body() banUserDto: BanUserDto): Promise<any> {
	// 	return this.userService.unsuspend(banUserDto);
	// }
}
