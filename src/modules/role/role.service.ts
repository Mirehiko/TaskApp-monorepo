import {HttpException, HttpStatus, Injectable, Param} from '@nestjs/common';
import {RoleRequestDto} from "./dto/role-request.dto";
import { Role } from './schemas/role.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {FindOneOptions, Repository} from 'typeorm';
import {RoleResponseDto} from "./dto/role-response.dto";
import {RoleRequestParams} from "./roleRequestParams";


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        public roleRepository: Repository<Role>,
    ) {}

    async getAll(): Promise<RoleResponseDto[]> {
        return await this.roleRepository.find();
    }

    async getByID(@Param() params: RoleRequestParams): Promise<RoleResponseDto | any> {
        try {
            const requestObject: FindOneOptions<Role> = {
                where: {id: params.id}
            };
            // if (params.withPermissions) {
                requestObject.relations = ['permissions'];
            // }

            const role = await this.roleRepository.findOne(requestObject);
            if (role) {
                return role;
                // response
                //     .status(HttpStatus.OK)
                //     .json(role);
            }
            throw new HttpException('Нет такой роли', HttpStatus.NOT_FOUND);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    async getBy(@Param() params): Promise<RoleResponseDto | any> {
        const role = await this.roleRepository.findOne(params);
        if (role) {
            return Object.assign(role, {permissions: []});
        }
        throw new HttpException('Нет такой роли', HttpStatus.NOT_FOUND);
    }

    async createRole(role: RoleRequestDto): Promise<any> {
        const candidate = await this.roleRepository.findOne({ name: role.name });
        if (candidate) {
            throw new HttpException('Такая роль уже существует. Введите другое имя роли', HttpStatus.CONFLICT);
        }
        try {
            const newRole = new Role();
            newRole.name = role.name;
            newRole.displayName = role.displayName;
            newRole.description = role.description;
            newRole.permissions = role.permissions
            await this.roleRepository.save(newRole);
            return newRole; // 201

        } catch (e) {
            throw new Error(e);
        }
    }

    async updateRole(@Param() id: number, roleRequestDto: RoleRequestDto): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({where: {id}});
        role.name = roleRequestDto.name;
        role.displayName = roleRequestDto.displayName;
        role.description = roleRequestDto.description;
        role.permissions = roleRequestDto.permissions;

        try {
            return await this.roleRepository.save(role);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    async deleteRole(@Param() id: number): Promise<any> {
        try {
            const role = await this.roleRepository.findOne({where: {id}});
            await this.roleRepository.remove(role);
            return {message: 'Successfully deleted'};
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
