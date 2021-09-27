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

    async getByID(@Param() id: number): Promise<PermissionResponseDto | any> {
        try {
            const permission = await this.permissionRepository.findOne({where: {id}});
            if (permission) {
                return  permission; // 200
            }
            else {
                return {message: "Нет такого пермишена"}; // 404
            }
        }
        catch (e) {
            console.log(e);
            return e;
        }
        return true;
    }

    async getBy(@Param() params): Promise<PermissionResponseDto | any> {
        const permission = await this.permissionRepository.findOne(params);
        if (permission) {
            return Object.assign(permission, {permissions: []});
        }
        else {
            return {message: "Нет такого пермишена"}; // 404
        }
    }

    async createPermission(permission: PermissionRequestDto): Promise<any> {
        const candidate = await this.permissionRepository.findOne({ name: permission.name });
        if (candidate) {
            return {message: "Такой пермишен уже существует. Введите другое имя пермишена"}; // 409
        }
        else {
            try {
                const newPermission = await this.permissionRepository.create({...permission});
                await this.permissionRepository.save(newPermission);
                return newPermission; // 201
            } catch (e) {
                console.log(e);
                return e;
            }
        }
        return true;
    }

    async updatePermission(@Param() id: string, permissionRequestDto: PermissionRequestDto): Promise<PermissionResponseDto> {
        const permission = await this.permissionRepository.findOne({where: {id}});
        permission.name = permissionRequestDto.name;
        permission.displayName = permissionRequestDto.displayName;
        permission.description = permissionRequestDto.description;
        console.log(permission)
        try {
            await this.permissionRepository.save(permission);
        }
        catch (e) {
            console.log(e);
            return e;
        }

        return permission; // 200
    }

    async deletePermission(@Param() id: number): Promise<any> {
        try {
            const permission = await this.permissionRepository.findOne({where: {id}});
            await this.permissionRepository.remove(permission);
        }
        catch (e) {
            console.log(e);
            return e;
        }
        return {message: 'Successfully deleted'} // 200
    }
}
