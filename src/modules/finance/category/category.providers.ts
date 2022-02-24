import { Connection, Repository } from 'typeorm';
import {Constants} from "../../../shared/enums/common/constants";
import { Category } from './schemas/category.entity';

export const categoryProviders = [
	{
		provide: Constants.CATEGORY_REPOSITORY,
		useFactory: (connection: Connection) => connection.getRepository(Category),
		inject: [Constants.DATABASE_CONNECTION],
	},
];
