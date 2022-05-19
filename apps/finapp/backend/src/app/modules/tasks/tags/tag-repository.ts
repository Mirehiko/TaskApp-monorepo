import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import { Tag } from './schemas/tag.entity';


// @EntityRepository(Tag)
// export class TagRepository extends Repository<Tag> {}

@EntityRepository(Tag)
export class TagTreeRepository extends TreeRepository<Tag>{}
