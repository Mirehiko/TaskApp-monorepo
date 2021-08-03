import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import { ID } from '../../shared/types/id.type';
import { UserRequestDto } from './dto/user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./schemas/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  async getAll(): Promise<UserResponseDto[]> {
    return;
  }

  async getById(id: ID): Promise<UserResponseDto> {
    const user: User = await this.usersRepository.findOne(id);
    const result: UserResponseDto = Object.assign(user, {permissions: []});
    return result;
  }

  async createUser(@Param() userRequestDto: UserRequestDto, @Res() response): Promise<any> {
    const candidate = await this.usersRepository.findOne({ email: userRequestDto.email });
    if (candidate) {
      response
          .status(HttpStatus.CONFLICT)
          .json({message: "Такой email уже существует. Введите другой email"});
    }
    else {
      // const salt = bcrypt.genSaltSync(10);
      // const password = req.body.password;
      //
      // console.log(req.body)

      // const userInfo = userRequestDto;
      // if (userRequestDto.avatar) {
      //   userInfo.avatar = req.body.avatar;
      // }

      // const newUser = new this.usersRepository(userRequestDto);

      try {

        // await user.save().then(() => {
        //   console.log('User created');
        // });
        // await newUser.save();


        response
            .status(HttpStatus.CREATED)
            // .json(newUser);


      } catch (error) { /*errorHandler(res, error);*/ }
    }
    // const newUser = new this.userModel(user);
    // return newUser.save();
  }

  async updateUser(@Param() id: ID, user: UserRequestDto): Promise<UserResponseDto> {
    // await this.usersRepository.update(id, user);
    // return newUser as UserResponseDto;
    return;
  }

  async deleteUser(id: ID): Promise<any> {
    return await this.usersRepository.delete(id);
  }
}
