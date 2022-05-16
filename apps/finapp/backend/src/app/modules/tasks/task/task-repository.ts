import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import { Task } from './schemas/task.entity';


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}

@EntityRepository(Task)
export class TaskTreeRepository extends TreeRepository<Task>{}

// export abstract class BaseTreeRepository extends TreeRepository {
//
// }
