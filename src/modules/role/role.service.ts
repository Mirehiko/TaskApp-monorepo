import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
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
        private roleRepository: Repository<Role>,
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
            else {
                return {message: "Нет такой роли"};
                // response
                //     .status(HttpStatus.NOT_FOUND)
                //     .json({message: "Нет такой роли"});
            }
        }
        catch (e) {
            console.log(e);
            return e;
            // response.json(e);
        }
        // return response;
    }

    async getBy(@Param() params): Promise<RoleResponseDto | any> {
        const role = await this.roleRepository.findOne(params);
        if (role) {
            return Object.assign(role, {permissions: []});
        }
        else {
            return {message: "Нет такой роли"}; // 404
        }
    }

    async createRole(role: RoleRequestDto): Promise<any> {
        const candidate = await this.roleRepository.findOne({ name: role.name });
        if (candidate) {
            return {message: "Такая роль уже существует. Введите другое имя роли"};
            // 409
        }
        else {
            try {
                const newRole = new Role();
                newRole.name = role.name;
                newRole.displayName = role.displayName;
                newRole.description = role.description;
                newRole.permissions = role.permissions
                await this.roleRepository.save(newRole);
                return newRole; // 201

            } catch (e) {
                console.log(e);
            }
        }
        return true;
    }

    async updateRole(@Param() id: number, roleRequestDto: RoleRequestDto): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({where: {id}});
        role.name = roleRequestDto.name;
        role.displayName = roleRequestDto.displayName;
        role.description = roleRequestDto.description;
        role.permissions = roleRequestDto.permissions;

        try {
            await this.roleRepository.save(role);
        }
        catch (e) {
            console.log(e);
        }

        return role;
    }

    async deleteRole(@Param() id: number): Promise<any> {
        try {
            const role = await this.roleRepository.findOne({where: {id}});
            await this.roleRepository.remove(role);
        }
        catch (e) {
            console.log(e)
        }
        return {message: 'Successfully deleted'};
    }
}
