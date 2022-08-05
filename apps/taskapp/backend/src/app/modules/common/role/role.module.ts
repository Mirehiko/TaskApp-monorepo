import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/user-repository';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { PermissionModule } from '../permission/permission.module';
import { PermissionRepository } from '../permission/permission-repository';
import { RoleRepository } from './role-repository';


@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [
    TypeOrmModule.forFeature(([RoleRepository, PermissionRepository, UserRepository])),
    AuthModule,
    PermissionModule
  ],
  exports: [
      RoleService
  ]
})
export class RoleModule {}
