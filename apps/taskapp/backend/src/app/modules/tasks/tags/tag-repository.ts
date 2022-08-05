import { EntityRepository } from 'typeorm';
import { Tag } from './schemas/tag.entity';
import { BaseTreeRepository } from '../../base-tree-repository';


@EntityRepository(Tag)
export class TagTreeRepository extends BaseTreeRepository<Tag>{}
