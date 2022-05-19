import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserRepository } from '../../common/user/user-repository';
import { TagTreeRepository } from '../tags/tag-repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TaskTreeRepository } from '../task/task-repository';


@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature(([TagTreeRepository, UserRepository, TaskTreeRepository])),
    // forwardRef(() => AuthModule)
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService]
})
export class TagModule {}
