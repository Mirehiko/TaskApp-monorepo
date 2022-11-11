import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from '../../common/user/user-repository';
import { AuthModule } from '../../common/auth/auth.module';
import { TaskCommentService } from './task-comment.service';
import { TaskCommentRepository } from './task-comment-repository';
import { TaskCommentController } from './task-comment.controller';
import { TaskTreeRepository } from '../task/task-repository';


@Module({
  imports: [
    TypeOrmModule.forFeature(([TaskCommentRepository, UserRepository, TaskTreeRepository])),
    AuthModule,
  ],
  providers: [TaskCommentService],
  controllers: [TaskCommentController],
  exports: [TaskCommentService]
})
export class TaskCommentModule {}
