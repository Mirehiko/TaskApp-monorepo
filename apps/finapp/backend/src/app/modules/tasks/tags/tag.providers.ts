import { Connection, Repository } from 'typeorm';
import {Constants} from "../../../shared/enums/common/constants";
import { Tag } from './schemas/tag.entity';


export const categoryProviders = [
  {
    provide: Constants.TAG_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(Tag),
    inject: [Constants.DATABASE_CONNECTION],
  },
];
