import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./modules/auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {User} from "./modules/user/schemas/user.entity";
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      entities: [User],
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private connection: Connection) {
  }
}
