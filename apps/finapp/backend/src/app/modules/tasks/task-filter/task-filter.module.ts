import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from '../../common/user/user-repository';
import { AuthModule } from '../../common/auth/auth.module';
import { TaskFilterRepository } from './task-filter-repository';
import { TaskFilterController } from './task-filter.controller';
import { TaskFilterService } from './task-filter.service';


@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature(([TaskFilterRepository, UserRepository])),
    AuthModule,
  ],
  providers: [TaskFilterService],
  controllers: [TaskFilterController],
  exports: [TaskFilterService]
})
export class TaskFilterModule {}
