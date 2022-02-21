import {HttpException, HttpStatus, Injectable, Param} from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import {PermissionResponseDto} from "./dto/permission-response.dto";

import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Permission } from './schemas/permission.entity';
import {PermissionRequestDto} from "./dto/permission-request.dto";


@Injectable()
export class PermissionService extends BaseService<Permission, GetParamsData> {
    protected entityNotFoundMessage: string = 'Нет такого пермишена';
    protected relations: string[];
    
    constructor(
        @InjectRepository(Permission)
        protected repository: Repository<Permission>,
    ) {
        super();
    }

    async createPermission(permission: PermissionRequestDto): Promise<Permission> {
        const candidate = await this.repository.findOne({ name: permission.name });
        if (candidate) {
            throw new HttpException('Такой пермишен уже существует. Введите другое имя пермишена', HttpStatus.CONFLICT);
        }

        try {
            const newPermission = await this.repository.create({...permission});
            await this.repository.save(newPermission);
            return newPermission; // 201
        } catch (e) {
            throw new Error(e);
        }
    }

    async updatePermission(@Param() id: string, permissionRequestDto: PermissionRequestDto): Promise<Permission> {
        const permission = await this.repository.findOne({where: {id}});
        permission.name = permissionRequestDto.name;
        permission.displayName = permissionRequestDto.displayName;
        permission.description = permissionRequestDto.description;

        try {
            return await this.repository.save(permission);
        }
        catch (e) {
            throw new Error(e);
        }
    }
}
