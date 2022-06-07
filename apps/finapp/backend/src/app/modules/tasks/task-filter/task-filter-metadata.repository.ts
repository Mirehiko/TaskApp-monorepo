import { EntityRepository, Repository } from 'typeorm';
import { TaskFilterMetadataEntity } from './schemas/task-filter-metadata.entity';


@EntityRepository(TaskFilterMetadataEntity)
export class TaskFilterMetadataRepository extends Repository<TaskFilterMetadataEntity> {}
