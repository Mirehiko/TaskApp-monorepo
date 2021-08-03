import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import {DatabaseModule} from "../database/database.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./schemas/user.entity";
// import {userProviders} from "./user.providers";

@Module({
  controllers: [UserController],
    providers: [UserService],
    // providers: [UserService, ...userProviders],
  imports: [
      // DatabaseModule,
      TypeOrmModule.forFeature(([User]))
  ],
})
export class UserModule {}
