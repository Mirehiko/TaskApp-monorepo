import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UserModule} from './modules/user/user.module';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./modules/auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {RoleModule} from './modules/role/role.module';
import {PermissionModule} from "./modules/permission/permission.module";
import {LoggingMiddleware} from "./middleware/logging-middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
      // envFilePath: `.${process.env.NODE_ENV.env}`
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT) || 3306,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          // migrationsRun: true,
          charset: 'UTF8',
          // migrations: [
          //   "src/migration/**/*.ts"
          // ],
        })
      // subscribers: [
      //   "src/subscriber/**/*.ts"
      // ],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  // controllers: [AppController],
})
export class AppModule implements NestModule {
  constructor(private connection: Connection) {
  }

    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(LoggingMiddleware)
            .forRoutes({path: '*', method: RequestMethod.ALL})
    }
}
