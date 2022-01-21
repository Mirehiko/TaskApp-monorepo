import {HttpException, HttpStatus, Injectable, Param} from '@nestjs/common';
import {UserRequestDto} from './dto/user-request.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./schemas/user.entity";
import {FindOneOptions, Repository} from "typeorm";
import {RoleService} from "../role/role.service";
import {UserGetParams} from "./userRequestParams";
import {UserRolesDto} from "./dto/assign-roles.dto";
import {BanUserDto} from "./dto/ban-user.dto";


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
      throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
    }
    catch (e) {
      throw new Error(e);
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
      const user = await this.usersRepository.findOne(requestObject);
      if (user) {
        return user;
      }
      throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  async createUser(@Param() userRequestDto: UserRequestDto): Promise<any> {
    const candidate = await this.usersRepository.findOne({ email: userRequestDto.email });
    if (candidate) {
      throw new HttpException('Такой email уже существует. Введите другой email', HttpStatus.CONFLICT);
    }

    try {
      const newUser = await this.usersRepository.create({...userRequestDto});
      let role;
      if (!userRequestDto.roles || !userRequestDto.roles.length) {
        role = await this.roleService.getByID({id: 8});
        newUser.roles = [role];
      }

      return await this.usersRepository.save(newUser); // 200
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(@Param() id: number, userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    let user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
    }

    user.email = userRequestDto.email ? userRequestDto.email : user.email;
    user.password = userRequestDto.password ? userRequestDto.password : user.password;
    user.avatar = userRequestDto.avatar ? userRequestDto.avatar : user.avatar;
    user.name = userRequestDto.name ? userRequestDto.name : user.name;

    try {
      await this.usersRepository.save(user);
      if (userRequestDto.roles) {
        user = await this.assignRolesToUser({userId: user.id, roles: userRequestDto.roles} );
      }
      return user;
    }
    catch (e) {
      throw new Error(e);
    }
  }

  async assignRolesToUser(userRolesDto: UserRolesDto): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});

    if (userRolesDto.roles.length && user) {
      if (userRolesDto.replaceRoles) {
        user.roles = userRolesDto.roles;
      }
      else {
        const uRoles = user.roles.map(ur => ur.id);
        user.roles = userRolesDto.roles.filter(r => !uRoles.includes(r.id)).concat(user.roles);
      }
      await this.usersRepository.save(user);
      return await this.getUserBy({id: user.id});
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async removeUserRoles(userRolesDto: UserRolesDto): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});

    if (userRolesDto.roles.length && user) {
      const roles = userRolesDto.roles.map(r => r.id);
      user.roles = user.roles.filter(ur => !roles.includes(ur.id));
      await this.usersRepository.save(user);
      return await this.getUserBy({id: user.id});
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async suspend(banUserDto: BanUserDto): Promise<any> {
    const users = await this.usersRepository.createQueryBuilder('user')
        .where('user.id IN (:userIds)', {userIds: banUserDto.userIds})
        .getMany();

    if (users.length) {
      users.forEach(user => {
        user.suspendedAt = new Date();
        user.suspendReason = banUserDto.reason;
      });
      await this.usersRepository.save(users);
      const uText = users.length > 1 ? 'Пользователи' : 'Пользователь';
      return {statusText: `${uText} успешно забанены`, status: HttpStatus.OK};
    }
    throw new HttpException('Пользователи не найдены', HttpStatus.NOT_FOUND);
  }

  async unsuspend(banUserDto: BanUserDto): Promise<any> {
    const users = await this.usersRepository.createQueryBuilder('user')
        .where('user.id IN (:userIds)', {userIds: banUserDto.userIds})
        .getMany();

    if (users.length) {
      users.forEach(user => {
        user.suspendedAt = null;
        user.suspendReason = null;
      });
      await this.usersRepository.save(users);
      const uText = users.length > 1 ? 'Пользователи' : 'Пользователь';
      return {statusText: `${uText} успешно забанены`, status: HttpStatus.OK};
    }
    throw new HttpException('Пользователи не найдены', HttpStatus.NOT_FOUND);
  }

  async deleteUser(id: number): Promise<any> {
    await this.usersRepository.delete(id);
    return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
  }
}


