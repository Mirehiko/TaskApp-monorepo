import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './modules/common/user/user.module';
import { AuthModule } from "./modules/common/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { RoleModule } from './modules/common/role/role.module';
import { PermissionModule } from "./modules/common/permission/permission.module";
import { LoggingMiddleware } from "./middleware/logging-middleware";
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { TokenModule } from "./modules/common/token/token.module";
import { configModule } from "./config/configure.root";
import { BillModule } from './modules/finance/bill/bill.module';
import { CategoryModule } from './modules/finance/category/category.module';
import { OperationModule } from './modules/finance/operation/operation.module';
import { TaskModule } from './modules/tasks/task/task.module';
import { TagModule } from './modules/tasks/tags/tag.module';
import { ListModule } from './modules/tasks/lists/list.module';
import { AppGateway } from './modules/common/gateway/gateway.gateway';
import { GatewayModule } from './modules/common/gateway/gateway.module';
import { TaskCommentModule } from './modules/tasks/task-comment/task-comment.module';
import { TaskFilterModule } from './modules/tasks/task-filter/task-filter.module';


@Module({
  imports: [
    configModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../static'),
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
        autoLoadEntities: true,
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
    FilesModule,
    TokenModule,
    BillModule,
    OperationModule,
    CategoryModule,
    TaskModule,
    TagModule,
    ListModule,
    GatewayModule,
    TaskCommentModule,
    TaskFilterModule,
  ],
  providers: [FilesService, AppGateway],
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
