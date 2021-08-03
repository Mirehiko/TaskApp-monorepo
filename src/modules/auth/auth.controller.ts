import {
    Body,
    Controller,
    Post, Res,
} from '@nestjs/common';
import { ID } from '../../shared/types/id.type';
import {AuthService} from "./auth.service";
import {UserResponseDto} from "../user/dto/user-response.dto";

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }
    @Post('register')
    register(@Body() body, @Res() response): Promise<any> {
        return this.authService.register(body, response);
    }

    @Post('login')
    login(@Body() body, @Res() response): Promise<any> {
        return this.authService.login(body, response);
    }

    @Post('logout')
    logout(@Body('id') id: ID): Promise<any> {
        // return this.authService.logout(id);
        return;
    }
}
