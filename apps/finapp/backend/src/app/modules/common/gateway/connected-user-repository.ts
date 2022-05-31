import { EntityRepository, Repository } from 'typeorm';
import { ConnectedUserEntity } from './schemas/connected-user.entity';


@EntityRepository(ConnectedUserEntity)
export class ConnectedUserRepository extends Repository<ConnectedUserEntity> {}
