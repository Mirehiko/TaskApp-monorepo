import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable, MethodNotAllowedException, Req,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import {User} from "../user/schemas/user.entity";
import {UserRequestDto} from "../user/dto/user-request.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {TokenService} from "../token/token.service";
import {CreateUserTokenDto} from "../token/dto/user-token-dto";
import {ConfigService} from "@nestjs/config";
import {UserStatusEnum} from "../user/user-status.enum";
import {ChangePasswordDto} from "./dto/change-password.dto";
import {ForgotPasswordDto} from "./dto/forgot-password.dto";
import {SignOptions} from "jsonwebtoken";
import * as moment from 'moment';

@Injectable()
export class AuthService {
    private readonly clientAppUrl: string;

    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        // this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
    }

    async signUp(userRequestDto: UserRequestDto): Promise<any> {
        const candidate = await this.userService.getBy({
            checkOnly: true,
            params: {email: userRequestDto.email}
        });
        if (candidate) {
            throw new HttpException("Такой email уже существует. Введите другой email", HttpStatus.CONFLICT);
        }
        userRequestDto.password += '';
        // const hashPassword = await bcrypt.hash(userRequestDto.password, 5);
        // const user = await this.userService.createUser({...userRequestDto, password: hashPassword});
        // return await this.generateToken(user);
        const user = await this.userService.createUser({...userRequestDto});
        await this.sendConfirmation(user);
        return true;
    }

    async signIn(userRequestDto: UserRequestDto): Promise<{ token: string }> {
        const user = await this.validateUser(userRequestDto);
        const token = await this.generateToken(user);
        if (user.status === UserStatusEnum.PENDING) {
            // user.status = UserStatusEnum.ACTIVE;
            // await this.userService.usersRepository.save(user);
            await this.sendConfirmation(user);
        }
        return {token: token};
    }

    async logout(token: string): Promise<any> {
        const data = await this.verifyToken(token);
        return await this.tokenService.deleteAll(data.id);
    }

    async signUser(user: User, withStatusCheck: boolean = true): Promise<string> {
        if (withStatusCheck && (user.status === UserStatusEnum.BLOCKED)) {
            throw new MethodNotAllowedException();
        }
        const token = await this.generateToken(user);
        const expireAt = moment()
            .add(1, 'day')
            .toISOString();

        await this.saveToken({
            token,
            expireAt,
            userId: user.id,
        });

        return token;
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<boolean> {
        const data = await this.verifyToken(changePasswordDto.token);
        const password = await this.userService.hashPassword(changePasswordDto.password);

        await this.userService.updateUser(data.id, {password});
        await this.tokenService.deleteAll(data.id);
        return true;
    }

    async confirm(token: string): Promise<User> {
        const data = await this.verifyToken(token);
        const user = await this.userService.getByID(data.id);

        await this.tokenService.delete(data.id, token);

        if (user && user.status === UserStatusEnum.PENDING) {
            user.status = UserStatusEnum.ACTIVE;
            return await this.userService.repository.save(user);
        }
        throw new BadRequestException('Confirmation error');
    }

    async sendConfirmation(user: User): Promise<void> {
        const token = await this.signUser(user, false);
        const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
        console.log(confirmLink);
        // await this.mailService.send({
        //     from: this.configService.get<string>('JS_CODE_MAIL'),
        //     to: user.email,
        //     subject: 'Verify User',
        //     html: `
        //         <h3>Hello ${user.firstName}!</h3>
        //         <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
        //     `,
        // });
    }

    private async generateToken(user: User, options?: SignOptions): Promise<string> {
        const payload = {email: user.email, id: user.id}; //еще роли, но что-то нет...
        return this.jwtService.sign(payload, options);
    }

    private async validateUser(userRequestDto: UserRequestDto): Promise<User> {
        const candidate = await this.userService.getBy({
            checkOnly: true,
            params: {email: userRequestDto.email}
        });
        const isPasswordEquals = await bcrypt.compare(userRequestDto.password + '', candidate.password);
        if (candidate && isPasswordEquals) {
            return candidate;
        }
        throw new UnauthorizedException({message: 'Incorrect email or password'});
    }


    private async verifyToken(token): Promise<any> {
        const data = this.jwtService.verify(token);
        const tokenExists = await this.tokenService.exists(data.id, token);
        if (tokenExists) {
            return data;
        }
        throw new UnauthorizedException();
    }

    private async saveToken(createUserTokenDto: CreateUserTokenDto) {
        return this.tokenService.create(createUserTokenDto);
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const user = await this.userService.getBy({
            params: {email: forgotPasswordDto.email}
        });
        if (!user) {
            throw new BadRequestException('Invalid email');
        }
        const token = await this.signUser(user);
        if (user.status === UserStatusEnum.PENDING) {
            await this.confirm(token);
        }
        const forgotLink = `${this.clientAppUrl}/auth/change-password?token=${token}`;
        console.log(forgotLink);
        // await this.mailService.send({
        //     from: this.configService.get<string>('JS_CODE_MAIL'),
        //     to: user.email,
        //     subject: 'Forgot Password',
        //     html: `
        //         <h3>Hello ${user.firstName}!</h3>
        //         <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
        //     `,
        // });
    }
}
