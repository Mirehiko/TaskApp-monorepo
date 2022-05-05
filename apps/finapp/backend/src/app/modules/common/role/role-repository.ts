import { EntityRepository, Repository } from 'typeorm';
import { Role } from './schemas/role.entity';


@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {}
