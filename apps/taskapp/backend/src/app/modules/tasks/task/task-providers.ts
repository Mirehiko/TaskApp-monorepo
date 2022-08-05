import { Connection } from 'typeorm';
import {Constants} from "../../../shared/enums/common/constants";
import { Task } from './schemas/task.entity';


export const taskProviders = [
	{
		provide: Constants.TASK_REPOSITORY,
		useFactory: (connection: Connection) => connection.getRepository(Task),
		inject: [Constants.DATABASE_CONNECTION],
	},
];
