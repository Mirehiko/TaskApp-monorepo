import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import { Category } from './schemas/category.entity';


// @EntityRepository(Category)
// export class CategoryRepository extends Repository<Category> {}

@EntityRepository(Category)
export class CategoryTreeRepository extends TreeRepository<Category>{}
