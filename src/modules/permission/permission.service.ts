import {HttpException, HttpStatus, Injectable, Param} from '@nestjs/common';
import {PermissionResponseDto} from "./dto/permission-response.dto";

import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Permission } from './schemas/permission.entity';
import {PermissionRequestDto} from "./dto/permission-request.dto";

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) {}


    async getAll(): Promise<PermissionResponseDto[]> {
        return await this.permissionRepository.find();
    }

    async getByID(@Param() id: number): Promise<PermissionResponseDto | any> {
        const permission = await this.permissionRepository.findOne({where: {id}});
        if (permission) {
            return permission; // 200
        }
        throw new HttpException('Нет такого пермишена', HttpStatus.NOT_FOUND);
    }

    async getBy(@Param() params): Promise<PermissionResponseDto | any> {
        const permission = await this.permissionRepository.findOne(params);
        if (permission) {
            return Object.assign(permission, {permissions: []});
        }
        throw new HttpException('Нет такого пермишена', HttpStatus.NOT_FOUND);
    }

    async createPermission(permission: PermissionRequestDto): Promise<any> {
        const candidate = await this.permissionRepository.findOne({ name: permission.name });
        if (candidate) {
            throw new HttpException('Такой пермишен уже существует. Введите другое имя пермишена', HttpStatus.CONFLICT);
        }

        try {
            const newPermission = await this.permissionRepository.create({...permission});
            await this.permissionRepository.save(newPermission);
            return newPermission; // 201
        } catch (e) {
            throw new Error(e);
        }
    }

    async updatePermission(@Param() id: string, permissionRequestDto: PermissionRequestDto): Promise<PermissionResponseDto> {
        const permission = await this.permissionRepository.findOne({where: {id}});
        permission.name = permissionRequestDto.name;
        permission.displayName = permissionRequestDto.displayName;
        permission.description = permissionRequestDto.description;

        try {
            return await this.permissionRepository.save(permission);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    async deletePermission(@Param() id: number): Promise<any> {
        try {
            const permission = await this.permissionRepository.findOne({where: {id}});
            await this.permissionRepository.remove(permission);
            return {message: 'Successfully deleted'} // 200
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
