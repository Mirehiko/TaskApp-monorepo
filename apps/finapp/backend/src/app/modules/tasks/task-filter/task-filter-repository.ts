import { EntityRepository, Repository } from 'typeorm';
import { TaskFilterEntity } from './schemas/task-filter.entity';


@EntityRepository(TaskFilterEntity)
export class TaskFilterRepository extends Repository<TaskFilterEntity> {}
