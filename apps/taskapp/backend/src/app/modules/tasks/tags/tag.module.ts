import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserRepository } from '../../common/user/user-repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TaskTreeRepository } from '../task/task-repository';
import { AuthModule } from '../../common/auth/auth.module';
import { TagTreeRepository } from './tag-repository';


@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature(([TagTreeRepository, UserRepository, TaskTreeRepository])),
    AuthModule,
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService]
})
export class TagModule {}
