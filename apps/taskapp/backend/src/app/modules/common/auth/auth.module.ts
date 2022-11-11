import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {TokenModule} from "../token/token.module";
import {JwtStrategy} from "./jwt.strategy";
import {PassportModule} from "@nestjs/passport";
import {configModule} from "../../../config/configure.root";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    configModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    }),
    TokenModule,
  ],
  exports: [
    AuthService,
    JwtModule,
    TokenModule,
  ]
})
export class AuthModule {}
