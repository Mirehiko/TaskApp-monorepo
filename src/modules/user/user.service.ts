import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import {UserRequestDto} from './dto/user-request.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./schemas/user.entity";
import {FindOneOptions, Repository} from "typeorm";
import {RoleService} from "../role/role.service";
import {UserGetParams} from "./userRequestParams";
import {RoleResponseDto} from "../role/dto/role-response.dto";


@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private roleService: RoleService
  ) {}

  async getAll(): Promise<UserResponseDto[]> {
    return await this.usersRepository.find();
  }

  async getById(@Param() userRequestParams: UserGetParams): Promise<UserResponseDto | any> {
    try {
      const requestObject: FindOneOptions<User> = {
        where: {id: userRequestParams.id}
      };
      // if (params.withPermissions) {
      requestObject.relations = ['roles', 'roles.permissions'];
      // }
      const user = await this.usersRepository.findOne(requestObject);
      if (user) {
        return user; // 200
      }
      else {
        return {status: HttpStatus.NOT_FOUND, message: "Нет такого пользователя"}; // 404
      }
    }
    catch (e) {
      console.log(e);
      return e;
    }
  }

  async getUserBy(userRequestParams: UserGetParams): Promise<UserResponseDto | any> {
    try {
      const requestObject: FindOneOptions<User> = {
        where: userRequestParams
      };

      // if (userRequestParams.withPermissions) {
        requestObject.relations = ['roles', 'roles.permissions'];
      // }
      // console.log('getUserBy', requestObject)
      const user = await this.usersRepository.findOne(requestObject);
      // console.log('get', user)
      if (user) {
        return user;
      }
      else {
        return {status: HttpStatus.NOT_FOUND, message: "Нет такого пользователя"}; // 404
      }
    }
    catch (e) {
      console.log(e);
      return e;
    }
  }

  async createUser(@Param() userRequestDto: UserRequestDto): Promise<any> {
    const candidate = await this.usersRepository.findOne({ email: userRequestDto.email });
    if (candidate) {
      return {message: "Такой email уже существует. Введите другой email"}; // 409
    }
    else {

      try {
        const newUser = await this.usersRepository.create({...userRequestDto});
        let role;
        if (!userRequestDto.roles || !userRequestDto.roles.length) {
          role = await this.roleService.getByID({id: 8});
          newUser.roles = [role];
        }

        await this.usersRepository.save(newUser)
        return newUser; // 200
      } catch (e) {
        console.log(e);
        return e;
      }
    }
  }

  async updateUser(@Param() id: number, userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: {id} });
    user.email = userRequestDto.email ? userRequestDto.email : user.email;
    user.password = userRequestDto.password ? userRequestDto.password : user.password;
    user.avatar = userRequestDto.avatar ? userRequestDto.avatar : user.avatar;
    user.name = userRequestDto.name ? userRequestDto.name : user.name;

    try {
      await this.usersRepository.save(user);
      if (userRequestDto.roles) {
        await this.assignRolesToUser(user.id, userRequestDto.roles);
      }

    }
    catch (e) {
      console.log(e);
      return e;
    }

    return user; // 200;
  }

  async assignRolesToUser(@Param() id: number, roles: RoleResponseDto[]): Promise<any> {
    const user = await this.usersRepository.findOne({ where: {id} });
    user.roles = roles;
    try {
      await this.usersRepository.save(user); // 200
    }
    catch (e) {
      console.log(e);
      return e;
    }

    return user;
  }

  async deleteUser(id: number): Promise<any> {
    return await this.usersRepository.delete(id);
  }
}


