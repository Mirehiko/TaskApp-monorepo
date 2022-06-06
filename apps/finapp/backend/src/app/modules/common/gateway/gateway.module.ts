import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { ConnectedUserRepository } from './connected-user-repository';
import { ConnectedUserService } from './connected-user.service';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from '../../tasks/task/task.module';
import { UserRepository } from '../user/user-repository';
import { UserModule } from '../user/user.module';
import { TaskCommentModule } from '../../tasks/task-comment/task-comment.module';


@Module({
  imports: [
    TypeOrmModule.forFeature(([ConnectedUserRepository, UserRepository])),
    AuthModule, UserModule, JwtModule, TaskModule, TaskCommentModule,
  ],
  providers: [ConnectedUserService],
  exports: [ConnectedUserService]
})
export class GatewayModule {}
