import { Connection } from 'typeorm';
import { Constants } from "../../../shared/enums/common/constants";
import { ConnectedUserEntity } from './schemas/connected-user.entity';


export const connectedUserProviders = [
  {
    provide: Constants.CONNECTED_USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(ConnectedUserEntity),
    inject: [Constants.DATABASE_CONNECTION],
  },
];
