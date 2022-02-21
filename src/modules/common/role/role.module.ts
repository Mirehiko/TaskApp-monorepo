import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/user-repository';
import { UserModule } from '../user/user.module';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Role } from './schemas/role.entity';
import { Permission } from '../permission/schemas/permission.entity';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [
      TypeOrmModule.forFeature(([Role, Permission, UserRepository])),
      AuthModule,
  ],
  exports: [
      RoleService
  ]
})
export class RoleModule {}
