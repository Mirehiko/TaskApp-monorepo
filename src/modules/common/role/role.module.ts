import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Role } from './schemas/role.entity';
import { Permission } from '../permission/schemas/permission.entity';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [
      TypeOrmModule.forFeature(([Role, Permission]))
  ],
  exports: [
      RoleService
  ]
})
export class RoleModule {}
