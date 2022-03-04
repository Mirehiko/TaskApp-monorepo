import { forwardRef, Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/user-repository';
import {Permission} from "./schemas/permission.entity";
import {PermissionController} from "./permission.controller";
import {PermissionService} from "./permission.service";

@Module({
    providers: [PermissionService],
    controllers: [PermissionController],
    imports: [
        TypeOrmModule.forFeature(([Permission, UserRepository])),
        AuthModule
        // TypeOrmModule.forFeature(([Permission, Role]))
    ],
    // exports: [
    //     PermissionService
    // ]
})
export class PermissionModule {}
