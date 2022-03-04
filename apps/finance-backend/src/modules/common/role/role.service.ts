import {HttpException, HttpStatus, Injectable, Param} from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import {RoleRequestDto} from "./dto/role-request.dto";
import { Role } from './schemas/role.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {FindOneOptions, Repository} from 'typeorm';
import {RoleResponseDto} from "./dto/role-response.dto";
import {RoleRequestParams} from "./roleRequestParams";


@Injectable()
export class RoleService extends BaseService<Role, GetParamsData> {
    protected entityNotFoundMessage: string = 'Нет такой роли';
    protected relations: string[] = ['roles', 'roles.permissions'];
    
    constructor(
        @InjectRepository(Role)
        protected repository: Repository<Role>,
    ) {
        super();
    }

    async createRole(role: RoleRequestDto): Promise<any> {
        const candidate = await this.repository.findOne({ name: role.name });
        if (candidate) {
            throw new HttpException('Такая роль уже существует. Введите другое имя роли', HttpStatus.CONFLICT);
        }
        try {
            const newRole = new Role();
            newRole.name = role.name;
            newRole.displayName = role.displayName;
            newRole.description = role.description;
            newRole.permissions = role.permissions
            await this.repository.save(newRole);
            return newRole; // 201

        } catch (e) {
            throw new Error(e);
        }
    }

    async updateRole(@Param() id: number, roleRequestDto: RoleRequestDto): Promise<Role> {
        const role = await this.repository.findOne({where: {id}});
        role.name = roleRequestDto.name;
        role.displayName = roleRequestDto.displayName;
        role.description = roleRequestDto.description;
        role.permissions = roleRequestDto.permissions;

        try {
            return await this.repository.save(role);
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
