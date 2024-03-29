import { Connection } from 'typeorm';
import {User} from "./schemas/user.entity";
import {Constants} from "../../../shared/enums/common/constants";


export const userProviders = [
  {
    provide: Constants.USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: [Constants.DATABASE_CONNECTION],
  },
];
