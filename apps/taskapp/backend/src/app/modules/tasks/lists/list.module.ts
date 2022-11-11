import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from '../../common/user/user-repository';
import { ListRepository } from './list-repository';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { TaskTreeRepository } from '../task/task-repository';
import { AuthModule } from '../../common/auth/auth.module';


@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature(([ListRepository, UserRepository, TaskTreeRepository])),
    AuthModule,
  ],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService]
})
export class ListModule {}
