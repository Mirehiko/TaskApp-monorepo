import {Body, HttpException, HttpStatus, Injectable, Res, UnauthorizedException} from '@nestjs/common';
import {UserResponseDto} from "../user/dto/user-response.dto";
import {UserResponse} from "../../shared/interfaces/user";
import {User} from "../user/schemas/user.entity";
import {UserRequestDto} from "../user/dto/user-request.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async register(userRequestDto: UserRequestDto): Promise<any> {
        const candidate = await this.userService.getUserBy({email: userRequestDto.email});
        console.log('auth', candidate)
        console.log(candidate.status === HttpStatus.NOT_FOUND)
        if (candidate.status !== HttpStatus.NOT_FOUND) {
            throw new HttpException("Такой email уже существует. Введите другой email", HttpStatus.CONFLICT);
        }
        userRequestDto.password += '';
        const hashPassword = await bcrypt.hash(userRequestDto.password, 5);
        const user = await this.userService.createUser({...userRequestDto, password: hashPassword});
        return await this.generateToken(user);
    }

    async login(@Body() body): Promise<any> {
        const userRequestParams: UserRequestDto = {
            email: body.email,
            password: body.password
        };
        const user = await this.validateUser(userRequestParams);
        return this.generateToken(user);
    }

    async logout(@Res() response): Promise<any> {
        response
            .status(HttpStatus.OK)
            .json({logout: true,});
        // res.status(200).json({
        //     logout: true,
        // });
    }

    private async generateToken(user: User): Promise<{token: string}> {
        const payload = {email: user.email, id: user.id}; //еще роли, но что-то нет...
        return {
            token: this.jwtService.sign(payload)
        };
    }

    private async validateUser(user: UserRequestDto): Promise<User> {
        const candidate = await this.userService.getUserBy({email: user.email});
        const isPasswordEquals = await bcrypt.compare(user.password + '', candidate.password);
        if (candidate && isPasswordEquals) {
            return candidate;
        }
        throw new UnauthorizedException({message: 'Incorrect email or password'});
    }


    private async verifyToken(token): Promise<any> {
        try {
            // const data = this.jwtService.verify(token);
            // const tokenExists = await this.jwtService.exists(data._id, token);
            // if (tokenExists) {
            //     return data;
            // }
            throw new UnauthorizedException();
        }
        catch(e) {
            throw new UnauthorizedException();
        }
    }

    private async saveToken(userResponse: UserResponse) {
        // const userToken = await this.tokenService.create(userResponse);
        // return userToken;userToken
        return;
    }
}
