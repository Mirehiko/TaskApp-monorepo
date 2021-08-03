import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./modules/auth/auth.module";

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_URI)

  ],
  controllers: [AppController],
})
export class AppModule {}
