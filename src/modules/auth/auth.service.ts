import {Body, HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {UserResponseDto} from "../user/dto/user-response.dto";
import {User, UserDocument} from "../user/schemas/user.schema";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async register(@Body() body, @Res() response): Promise<boolean> {
        const email: string = body.email;
        const password: string = body.password;
        const candidate = await this.userModel.findOne({ email: email });
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
            const newUser = new this.userModel({
                email,
                password,
                name: '',
            });
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
                await newUser.save();
                response
                    .status(HttpStatus.CREATED)
                    .json(newUser);
            } catch (error) {
                // errorHandler(res, error);
            }
        }
        return;
    }

    async login(@Body() body, @Res() response): Promise<UserResponseDto> {
        const email: string = body.email;
        const password: string = body.password;
        const candidate = await this.userModel.findOne({email: email});

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
}
