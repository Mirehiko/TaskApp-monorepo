import {HttpException, HttpStatus, Injectable, Param} from '@nestjs/common';
import { BaseService } from '../../base-service';
import {UserRequestDto} from './dto/user-request.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./schemas/user.entity";
import {FindOneOptions, Repository} from "typeorm";
import {RoleService} from "../role/role.service";
import {UserGetParams} from "./userRequestParams";
import {UserRolesDto} from "./dto/assign-roles.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {FilesService} from "../../../files/files.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService extends BaseService<User> {
  private readonly saltRounds = 10;

  constructor(
      @InjectRepository(User)
      protected repository: Repository<User>,
      private roleService: RoleService,
      private fileService: FilesService,
  ) {
    super();
  }

  async getById(@Param() userGetParams: UserGetParams): Promise<User | any> {
    try {
      const requestObject: FindOneOptions<User> = {
        where: {id: userGetParams.id}
      };
      // if (params.withPermissions) {
      requestObject.relations = ['roles', 'roles.permissions'];
      // }
      const user = await this.repository.findOne(requestObject);
      if (user) {
        return user; // 200
      }
      throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  async getUserBy(userGetParams: UserGetParams, checkOnly?: boolean): Promise<User> {
    try {
      const requestObject: FindOneOptions<User> = {
        where: userGetParams
      };

      // if (userRequestParams.withPermissions) {
        requestObject.relations = ['roles', 'roles.permissions'];
      // }
      const user = await this.repository.findOne(requestObject);
      if (user) {
        return user;
      }

      if (checkOnly) {
        return;
      }
      throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  async createUser(@Param() userRequestDto: UserRequestDto): Promise<any> {
    const candidate = await this.repository.findOne({ email: userRequestDto.email });
    if (candidate) {
      throw new HttpException('Такой email уже существует. Введите другой email', HttpStatus.CONFLICT);
    }

    try {
      const newUser = await this.repository.create({...userRequestDto});
      let role;
      if (!userRequestDto.roles || !userRequestDto.roles.length) {
        role = await this.roleService.getByID({id: 8});
        newUser.roles = [role];
      }

      return await this.repository.save(newUser); // 200
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(@Param() id: number, userRequestDto: UserRequestDto, avatar?: any): Promise<User> {
    let user = await this.repository.findOne(id);
    if (!user) {
      throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
    }
    user.email = userRequestDto.email ? userRequestDto.email : user.email;
    user.password = userRequestDto.password ? userRequestDto.password : user.password;
    // user.avatar = userRequestDto.avatar ? userRequestDto.avatar : user.avatar;
    user.name = userRequestDto.name ? userRequestDto.name : user.name;

    if(avatar) {
      user.avatar = await this.fileService.createFile(avatar);
    }

    try {
      await this.repository.save(user);
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
    const user = await this.repository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});

    if (userRolesDto.roles.length && user) {
      if (userRolesDto.replaceRoles) {
        user.roles = userRolesDto.roles;
      }
      else {
        const uRoles = user.roles.map(ur => ur.id);
        user.roles = userRolesDto.roles.filter(r => !uRoles.includes(r.id)).concat(user.roles);
      }
      await this.repository.save(user);
      return await this.getUserBy({id: user.id});
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async removeUserRoles(userRolesDto: UserRolesDto): Promise<any> {
    const user = await this.repository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});

    if (userRolesDto.roles.length && user) {
      const roles = userRolesDto.roles.map(r => r.id);
      user.roles = user.roles.filter(ur => !roles.includes(ur.id));
      await this.repository.save(user);
      return await this.getUserBy({id: user.id});
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async suspend(banUserDto: BanUserDto): Promise<any> {
    const users = await this.repository.createQueryBuilder('user')
        .where('user.id IN (:userIds)', {userIds: banUserDto.userIds})
        .getMany();

    if (users.length) {
      users.forEach(user => {
        user.suspendedAt = new Date();
        user.suspendReason = banUserDto.reason;
      });
      await this.repository.save(users);
      const uText = users.length > 1 ? 'Пользователи' : 'Пользователь';
      return {statusText: `${uText} успешно забанены`, status: HttpStatus.OK};
    }
    throw new HttpException('Пользователи не найдены', HttpStatus.NOT_FOUND);
  }

  async unsuspend(banUserDto: BanUserDto): Promise<any> {
    const users = await this.repository.createQueryBuilder('user')
        .where('user.id IN (:userIds)', {userIds: banUserDto.userIds})
        .getMany();

    if (users.length) {
      users.forEach(user => {
        user.suspendedAt = null;
        user.suspendReason = null;
      });
      await this.repository.save(users);
      const uText = users.length > 1 ? 'Пользователи' : 'Пользователь';
      return {statusText: `${uText} успешно забанены`, status: HttpStatus.OK};
    }
    throw new HttpException('Пользователи не найдены', HttpStatus.NOT_FOUND);
  }



  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }
}


