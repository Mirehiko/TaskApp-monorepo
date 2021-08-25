import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import {ID} from '../../shared/types/id.type';
import {UserRequestDto} from './dto/user-request.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./schemas/user.entity";
import {Repository} from "typeorm";
import {RoleService} from "../role/role.service";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private roleService: RoleService
  ) {}

  async getAll(): Promise<UserResponseDto[]> {
    return;
  }

  async getById(@Param() id: string): Promise<UserResponseDto> {
    const user: User = await this.usersRepository.findOne(id);
    return Object.assign(user, {roles: []});
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

      // if (userRequestDto.avatar) {
      //   userInfo.avatar = req.body.avatar;
      // }


      try {
        // const role = await this.roleService.getBy({name: 'USER'}, response)
        const newUser = await this.usersRepository.create({...userRequestDto});
        // newUser.roles = [role];
        await this.usersRepository.save(newUser).then(() => {
          console.log('User created');
        });
        // await this.usersRepository.save(newUser);
        response
            .status(HttpStatus.CREATED)
            .json(newUser);

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

  async deleteUser(id: string): Promise<any> {
    return await this.usersRepository.delete(id);
  }
}
