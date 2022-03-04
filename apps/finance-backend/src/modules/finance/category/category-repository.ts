import { EntityRepository, Repository } from 'typeorm';
import { Category } from './schemas/category.entity';


@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {}