import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import {RoleRequestDto} from "./dto/role-request.dto";
import { Role } from './schemas/role.entity';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {RoleResponseDto} from "./dto/role-response.dto";
import {ObjectID} from "mongodb";


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async getAll(): Promise<RoleResponseDto[]> {
        return await this.roleRepository.find();
    }

    async getByID(@Param() id: string, @Res() response): Promise<RoleResponseDto | any> {
        try {
            const role = await this.roleRepository.findOne({where: {_id: new ObjectID(id)}});
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
                const newRole = await this.roleRepository.create({...role});
                newRole.permissions = role.permissions;
                role.permissions.map(p => {
                    // newRole.permissionIds.add(p.id)
                    return p;
                })
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

    async updateRole(@Param() id: string, roleRequestDto: RoleRequestDto, @Res() response): Promise<RoleResponseDto> {
        const role = await this.roleRepository.findOne({where: {_id: new ObjectID(id)}});
        role.name = roleRequestDto.name;
        role.displayName = roleRequestDto.displayName;
        role.description = roleRequestDto.description;
        console.log(role)
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

    async deleteRole(@Param() id: string, @Res() response): Promise<any> {
        try {
            const role = await this.roleRepository.findOne({where: {_id: new ObjectID(id)}});
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
