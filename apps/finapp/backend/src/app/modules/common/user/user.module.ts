import {forwardRef, Module} from '@nestjs/common';
import { UserRepository } from './user-repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "../role/schemas/role.entity";
import { RoleModule } from '../role/role.module';
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../../../files/files.module";
import { ConnectedUserRepository } from '../gateway/connected-user-repository';


@Module({
    imports: [
        TypeOrmModule.forFeature(([UserRepository, ConnectedUserRepository, Role, ])),
        RoleModule,
        FilesModule,
        forwardRef(() => AuthModule)
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
