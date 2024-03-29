import { EntityRepository, Repository } from 'typeorm';
import { User } from './schemas/user.entity';


@EntityRepository(User)
export class UserRepository extends Repository<User> {}