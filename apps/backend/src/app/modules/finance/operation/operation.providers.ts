import { Connection, Repository } from 'typeorm';
import {Constants} from "../../../shared/enums/common/constants";
import { Operation } from './schemas/operation.entity';

export const operationProviders = [
	{
		provide: Constants.OPERATION_REPOSITORY,
		useFactory: (connection: Connection) => connection.getRepository(Operation),
		inject: [Constants.DATABASE_CONNECTION],
	},
];
