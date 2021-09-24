import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import {PermissionResponseDto} from "./dto/permission-response.dto";

import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Permission } from './schemas/permission.entity';
import {PermissionRequestDto} from "./dto/permission-request.dto";
import { ObjectID } from 'mongodb';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) {}


    async getAll(): Promise<PermissionResponseDto[]> {
        return await this.permissionRepository.find();
    }

    async getByID(@Param() id: number, @Res() response): Promise<PermissionResponseDto | any> {
        try {
            const permission = await this.permissionRepository.findOne({where: {id}});
            if (permission) {
                response
                    .status(HttpStatus.OK)
                    .json(permission);
            }
            else {
                response
                    .status(HttpStatus.NOT_FOUND)
                    .json({message: "Нет такого пермишена"});
            }
        }
        catch (e) {
            console.log(e);
            response.json(e);
        }
        return response;
    }

    async getBy(@Param() params, @Res() response): Promise<PermissionResponseDto | any> {
        const permission = await this.permissionRepository.findOne(params);
        if (permission) {
            return Object.assign(permission, {permissions: []});
        }
        else {
            response
                .status(HttpStatus.NOT_FOUND)
                .json({message: "Нет такого пермишена"});
        }
    }

    async createPermission(permission: PermissionRequestDto, @Res() response): Promise<any> {
        const candidate = await this.permissionRepository.findOne({ name: permission.name });
        if (candidate) {
            response
                .status(HttpStatus.CONFLICT)
                .json({message: "Такой пермишен уже существует. Введите другое имя пермишена"});
        }
        else {
            try {
                const newPermission = await this.permissionRepository.create({...permission});
                await this.permissionRepository.save(newPermission);
                response
                    .status(HttpStatus.CREATED)
                    .json(newPermission);

            } catch (e) {
                console.log(e);
                response.json(e);
            }
        }
        return response;
    }

    async updatePermission(@Param() id: string, permissionRequestDto: PermissionRequestDto, @Res() response): Promise<PermissionResponseDto> {
        const permission = await this.permissionRepository.findOne({where: {id}});
        permission.name = permissionRequestDto.name;
        permission.displayName = permissionRequestDto.displayName;
        permission.description = permissionRequestDto.description;
        console.log(permission)
        try {
            await this.permissionRepository.save(permission);
            response
                .status(HttpStatus.OK)
                .json(permission);
        }
        catch (e) {
            response.json(e)
        }

        return response;
    }

    async deletePermission(@Param() id: number, @Res() response): Promise<any> {
        try {
            const permission = await this.permissionRepository.findOne({where: {id}});
            await this.permissionRepository.remove(permission);
            response.status(HttpStatus.OK).json({message: 'Successfully deleted'});
        }
        catch (e) {
            response.json(e);
        }
        return response;
    }
}
