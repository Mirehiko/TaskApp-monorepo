import { EntityRepository, Repository } from 'typeorm';
import { List } from './schemas/list.entity';


@EntityRepository(List)
export class ListRepository extends Repository<List> {}
