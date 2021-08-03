import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/schemas/user.schema";
import {AuthService} from "./auth.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
})
export class AuthModule {}
