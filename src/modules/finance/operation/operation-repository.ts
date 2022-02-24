import { EntityRepository, Repository } from 'typeorm';
import { Operation } from './schemas/operation.entity';


@EntityRepository(Operation)
export class OperationRepository extends Repository<Operation> {}