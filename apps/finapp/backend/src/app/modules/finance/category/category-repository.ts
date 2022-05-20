import { EntityRepository } from 'typeorm';
import { Category } from './schemas/category.entity';
import { BaseTreeRepository } from '../../base-tree-repository';


// @EntityRepository(Category)
// export class CategoryRepository extends Repository<Category> {}

@EntityRepository(Category)
export class CategoryTreeRepository extends BaseTreeRepository<Category>{}
