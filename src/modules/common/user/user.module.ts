import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./schemas/user.entity";
import {Role} from "../role/schemas/role.entity";
import { RoleModule } from '../role/role.module';
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../../../files/files.module";

@Module({
    imports: [
        // DatabaseModule,
        TypeOrmModule.forFeature(([User, Role])),
        RoleModule,
        FilesModule,
        forwardRef(() => AuthModule)
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
