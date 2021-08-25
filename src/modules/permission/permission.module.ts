import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
// import { Role } from '../role/schemas/role.entity';
import {Permission} from "./schemas/permission.entity";
import {PermissionController} from "./permission.controller";
import {PermissionService} from "./permission.service";

@Module({
    providers: [PermissionService],
    controllers: [PermissionController],
    imports: [
        TypeOrmModule.forFeature(([Permission]))
        // TypeOrmModule.forFeature(([Permission, Role]))
    ],
    // exports: [
    //     PermissionService
    // ]
})
export class PermissionModule {}
