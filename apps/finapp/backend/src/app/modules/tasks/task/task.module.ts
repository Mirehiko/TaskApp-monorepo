import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskTreeRepository } from './task-repository';
import { UserRepository } from '../../common/user/user-repository';
import { TagTreeRepository } from '../tags/tag-repository';
import { ListRepository } from '../lists/list-repository';
import { AuthModule } from '../../common/auth/auth.module';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([TaskTreeRepository, UserRepository, TagTreeRepository, ListRepository])),
		// forwardRef(() => AuthModule)
    AuthModule,
	],
	providers: [TaskService],
	controllers: [TaskController],
	exports: [TaskService]
})
export class TaskModule {}
