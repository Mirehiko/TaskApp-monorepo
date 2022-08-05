import { EntityRepository, Repository } from 'typeorm';
import { Permission } from './schemas/permission.entity';


@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {}
