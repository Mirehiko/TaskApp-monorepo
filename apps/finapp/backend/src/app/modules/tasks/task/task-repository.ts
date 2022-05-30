import { EntityRepository } from 'typeorm';
import { Task } from './schemas/task.entity';
import { BaseTreeRepository } from '../../base-tree-repository';


@EntityRepository(Task)
export class TaskTreeRepository extends BaseTreeRepository<Task>{
}


