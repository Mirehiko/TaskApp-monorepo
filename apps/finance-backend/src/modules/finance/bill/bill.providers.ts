import { Connection, Repository } from 'typeorm';
import {Constants} from "../../../shared/enums/common/constants";
import { Bill } from './schemas/bill.entity';

export const billProviders = [
	{
		provide: Constants.BILL_REPOSITORY,
		useFactory: (connection: Connection) => connection.getRepository(Bill),
		inject: [Constants.DATABASE_CONNECTION],
	},
];
