import { EntityRepository } from 'typeorm';
import { BaseListRepository } from '../../base-list-repository';
import { List } from './schemas/list.entity';


@EntityRepository(List)
export class ListRepository extends BaseListRepository<List> {}
