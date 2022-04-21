import { EntityRepository, Repository } from 'typeorm';
import { Tag } from './schemas/tag.entity';


@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {}
