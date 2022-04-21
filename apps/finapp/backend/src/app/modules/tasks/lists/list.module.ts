import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserRepository } from '../../common/user/user-repository';
import { TaskRepository } from '../task/task-repository';
import { ListRepository } from './list-repository';
import { ListController } from './list.controller';
import { ListService } from './list.service';


@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature(([ListRepository, UserRepository, TaskRepository])),
    // forwardRef(() => AuthModule)
  ],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService]
})
export class ListModule {}
