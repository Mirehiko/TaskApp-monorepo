

import { Connection, Repository } from 'typeorm';
import {Constants} from "../../../shared/enums/common/constants";
import {Permission} from "./schemas/permission.entity";

export const permissionProviders = [
    {
        provide: Constants.PERMISSION_REPOSITORY,
        useFactory: (connection: Connection) => connection.getRepository(Permission),
        inject: [Constants.DATABASE_CONNECTION],
    },
];

