import { EntityRepository, Repository } from 'typeorm';
import { TaskCommentEntity } from './schemas/task-comment.entity';


@EntityRepository(TaskCommentEntity)
export class TaskCommentRepository extends Repository<TaskCommentEntity> {}
