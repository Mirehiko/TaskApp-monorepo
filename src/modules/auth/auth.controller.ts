import {
    Body,
    Controller,
    Post, Res,
} from '@nestjs/common';
import { ID } from '../../shared/types/id.type';
import {AuthService} from "./auth.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../user/schemas/user.entity";

@ApiTags('Авторизация')
@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiResponse({status: 201, type: User})
    @Post('registration')
    register(@Body() body): Promise<any> {
        return this.authService.register(body);
    }

    @ApiOperation({summary: 'Вход в систему'})
    @ApiResponse({status: 200, type: User})
    @Post('login')
    login(@Body() body): Promise<any> {
        return this.authService.login(body);
    }

    @ApiOperation({summary: 'Выход из системы'})
    @ApiResponse({status: 200, type: User})
    @Post('logout')
    logout(@Body('id') id: ID): Promise<any> {
        // return this.authService.logout(id);
        return;
    }

    @ApiOperation({summary: 'Восстановление пароля'})
    @ApiResponse({status: 200, type: User})
    @Post('recover')
    recoverPass(@Body('id') id: ID): Promise<any> {
        // return this.authService.logout(id);
        return;
    }
}
