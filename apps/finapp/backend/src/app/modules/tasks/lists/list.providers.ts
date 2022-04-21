import { Connection, Repository } from 'typeorm';
import {Constants} from "../../../shared/enums/common/constants";
import { List } from './schemas/list.entity';


export const categoryProviders = [
  {
    provide: Constants.LIST_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(List),
    inject: [Constants.DATABASE_CONNECTION],
  },
];
