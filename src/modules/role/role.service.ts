import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import {RoleRequestDto} from "./dto/role-request.dto";
import { Role } from './schemas/role.entity';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {RoleResponseDto} from "./dto/role-response.dto";
import {RoleRequestParams} from "./params";


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async getAll(): Promise<RoleResponseDto[]> {
        return await this.roleRepository.find();
    }

    async getByID(@Param() params: RoleRequestParams, @Res() response): Promise<RoleResponseDto | any> {
        try {
            const requestObject = {
                where: {id: params.id}
            };
            // if (params.withPermissions) {
                requestObject['relations'] = ['permissions']
            // }
            const role = await this.roleRepository.findOne(requestObject);
            if (role) {
                response
                    .status(HttpStatus.OK)
                    .json(role);
            }
            else {
                response
                    .status(HttpStatus.NOT_FOUND)
                    .json({message: "Нет такой роли"});
            }
        }
        catch (e) {
            console.log(e);
            response.json(e);
        }
        return response;
    }

    async getBy(@Param() params, @Res() response): Promise<RoleResponseDto | any> {
        const role = await this.roleRepository.findOne(params);
        if (role) {
            return Object.assign(role, {permissions: []});
        }
        else {
            response
                .status(HttpStatus.NOT_FOUND)
                .json({message: "Нет такой роли"});
        }
    }

    async createRole(role: RoleRequestDto, @Res() response): Promise<any> {
        const candidate = await this.roleRepository.findOne({ name: role.name });
        if (candidate) {
            response
                .status(HttpStatus.CONFLICT)
                .json({message: "Такая роль уже существует. Введите другое имя роли"});
        }
        else {
            try {
                const newRole = new Role();
                newRole.name = role.name;
                newRole.displayName = role.displayName;
                newRole.description = role.description;
                newRole.permissions = role.permissions
                await this.roleRepository.save(newRole);
                response
                    .status(HttpStatus.CREATED)
                    .json(newRole);

            } catch (e) {
                console.log(e);
                response.json(e);
            }
        }
        return response;
    }

    async updateRole(@Param() id: number, roleRequestDto: RoleRequestDto, @Res() response): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({where: {id}});
        role.name = roleRequestDto.name;
        role.displayName = roleRequestDto.displayName;
        role.description = roleRequestDto.description;
        role.permissions = roleRequestDto.permissions;

        try {
            await this.roleRepository.save(role);
            response
                .status(HttpStatus.OK)
                .json(role);
        }
        catch (e) {
            response.json(e)
        }

        return response;
    }

    async deleteRole(@Param() id: number, @Res() response): Promise<any> {
        try {
            const role = await this.roleRepository.findOne({where: {id}});
            await this.roleRepository.remove(role);
            response.status(HttpStatus.OK).json({message: 'Successfully deleted'});
        }
        catch (e) {
            response.json(e);
        }
        console.log(response)
        return response;
    }
}
