import {
    Body,
    Controller, Get, Patch,
    Post, Query, Res,
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../user/schemas/user.entity";
import {
  AuthResponseDto,
  AuthUserDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  UserRequestDto,
  UserResponseDto
} from '@finapp/app-common';
import { plainToClass } from 'class-transformer';


// TODO: Use class-transformer
@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status: 201, type: User})
  @Post('registration')
  async register(@Body() userRequestDto: UserRequestDto): Promise<any> {
    return this.authService.signUp(userRequestDto);
  }

  @ApiOperation({summary: 'Вход в систему'})
  @ApiResponse({status: 200, type: User})
  @Post('login')
  async login(@Body() authUserDto: AuthUserDto): Promise<AuthResponseDto> {
    const authUser = await this.authService.signIn(authUserDto);
    return plainToClass(AuthResponseDto, authUser, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Выход из системы'})
  @ApiResponse({status: 200, type: User})
  @Post('logout')
  async logout(@Body() query: { token: string }): Promise<any> {
    return this.authService.logout(query.token);
  }

  @Get('/confirm')
  async confirm(@Query() query: { token: string }): Promise<boolean> {
    await this.authService.confirm(query.token);
    return true;
  }

  @ApiOperation({summary: 'Восстановление пароля'})
  @Post('/forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({summary: 'Получение пользователя по токену'})
  @Post('/by-token')
  async getUserByToken(@Body() body): Promise<UserResponseDto> {
    const user = this.authService.getUserByToken(body.token);
    return plainToClass(UserResponseDto, user, { enableCircularCheck: true });
  }

  @Patch('/change-password')
  // @UseGuards(AuthGuard())
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    // @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return this.authService.changePassword(changePasswordDto);
  }
}
