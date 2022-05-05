import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import { Role } from './schemas/role.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { RoleRequestDto } from '@finapp/app-common';
import { PermissionService } from '../permission/permission.service';


@Injectable()
export class RoleService extends BaseService<Role, GetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такой роли';
  protected relations: string[] = ['permissions'];

  constructor(
    @InjectRepository(Role)
    protected repository: Repository<Role>,
    // TODO: Replace with Permission Repository
    private permissionService: PermissionService
  ) {
    super();
  }

  async createRole(role: RoleRequestDto): Promise<any> {
    const candidate = await this.repository.findOne({ name: role.name });
    if (candidate) {
      throw new HttpException('Такая роль уже существует. Введите другое имя роли', HttpStatus.CONFLICT);
    }
    // TODO: Replace with Permission Repository
    // TODO: Get permissions from params
    const permissions = await this.permissionService.getAll();

    try {
      const newRole = new Role();
      newRole.name = role.name;
      newRole.displayName = role.displayName;
      newRole.description = role.description;
      newRole.permissions = permissions;
      await this.repository.save(newRole);
      return newRole; // 201

    } catch (e) {
      throw new Error(e);
    }
  }

  async updateRole(@Param() id: number, roleRequestDto: RoleRequestDto): Promise<Role> {
    const role = await this.repository.findOne({where: {id}});
    if (!role) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    // TODO: Replace with Permission Repository
    // TODO: Get permissions from params
    const permissions = await this.permissionService.getAll();
    role.name = roleRequestDto.name;
    role.displayName = roleRequestDto.displayName;
    role.description = roleRequestDto.description;
    role.permissions = permissions;

    try {
      return await this.repository.save(role);
    }
    catch (e) {
      throw new Error(e);
    }
  }
}
