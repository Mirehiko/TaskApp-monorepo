import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { User } from '../../common/user/schemas/user.entity';
import { Task } from './schemas/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepository, TaskTreeRepository } from './task-repository';
import { UserRepository } from '../../common/user/user-repository';
import { TagRepository } from '../tags/tag-repository';
import { ListRepository } from '../lists/list-repository';
import { AuthModule } from '../../common/auth/auth.module';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([TaskRepository, TaskTreeRepository, UserRepository, TagRepository, ListRepository])),
		// forwardRef(() => AuthModule)
    AuthModule,
	],
	providers: [TaskService],
	controllers: [TaskController],
	exports: [TaskService]
})
export class TaskModule {}
