import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserRepository } from '../../common/user/user-repository';
import { TagRepository } from '../tags/tag-repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TaskRepository } from '../task/task-repository';


@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature(([TagRepository, UserRepository, TaskRepository])),
    // forwardRef(() => AuthModule)
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService]
})
export class TagModule {}
