import { Connection, Repository } from 'typeorm';
import {Constants} from "../../shared/enums/constants";
import {Role} from "./schemas/role.entity";

export const roleProviders = [
    {
        provide: Constants.USER_REPOSITORY,
        useFactory: (connection: Connection) => connection.getRepository(Role),
        inject: [Constants.DATABASE_CONNECTION],
    },
];

