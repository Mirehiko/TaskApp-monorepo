import {Body, HttpStatus, Injectable, Res, UnauthorizedException} from '@nestjs/common';
import {UserResponseDto} from "../user/dto/user-response.dto";
import {UserResponse} from "../../shared/interfaces/user";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../user/schemas/user.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async register(@Body() body, @Res() response): Promise<boolean> {
        const email: string = body.email;
        const password: string = body.password;
        const candidate = await this.usersRepository.findOne({ email: email });
        console.log(candidate, email, password)

        if (candidate) {
            response
                .status(HttpStatus.CONFLICT)
                .json({message: "Такой email уже существует. Введите другой email"});
        } else {
            // const salt = bcrypt.genSaltSync(10);
            // const password = req.body.password;
            // const role = await Role.findOne({ code_name: "default" });
            //
            // const newUser = new this.usersRepository.save({
            //     email,
            //     password,
            //     name: '',
            // });
            // const user = new User({
            //     email: req.body.email,
            //     password: bcrypt.hashSync(password, salt),
            //     role: role._id,
            //     name: req.body.name ? req.body.name : '',
            //     avatar: req.body.avatar ? req.body.avatar : ''
            // });

            try {
                // await this.userModel.save().then(() => {
                //     console.log("User created");
                // });
                // await newUser.save();
                response
                    .status(HttpStatus.CREATED)
                    // .json(newUser);
            } catch (error) {
                // errorHandler(res, error);
            }
        }
        return;
    }

    async login(@Body() body, @Res() response): Promise<UserResponseDto> {
        const email: string = body.email;
        const password: string = body.password;
        const candidate = await this.usersRepository.findOne({email: email});

        if (candidate) {
            // const passwordResult = bcrypt.compareSync(
            //     req.body.password,
            //     candidate.password
            // );
            const passwordResult = password === candidate.password;

            if (passwordResult) {
                // const role = await Role.findById(candidate.role);
                // const token = jwt.sign(
                //     {
                //         email: candidate.email,
                //         userId: candidate._id,
                //     },
                //     keys.jwt,
                //     {
                //         expiresIn: 36000,
                //     }
                // );
                //
                // req.session.user = {
                //     _id: candidate._id,
                //     email: candidate.email,
                //     role: candidate.role,
                //     isAdmin: role.code_name === 'administrator'
                // };
                response
                    .status(HttpStatus.OK)
                    .json({
                        // token: `Bearer ${token}`,
                        // user: req.session.user
                    });

            } else {
                response
                    .status(HttpStatus.UNAUTHORIZED)
                    .json({message: "Пароли не совпадают"});
            }
        } else {
            response
                .status(HttpStatus.EXPECTATION_FAILED)
                .json({message: "Пользователь с такими данными не найден",});
        }
        return;
    }

    async logout(@Res() response): Promise<any> {
        response
            .status(HttpStatus.OK)
            .json({logout: true,});
        // res.status(200).json({
        //     logout: true,
        // });
    }

    private async generateToken(data: any, options?: any): Promise<string> {
        // return this.jwtService.sign(data: options);
        return;
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
