import { EntityRepository, Repository } from 'typeorm';
import { Bill } from './schemas/bill.entity';


@EntityRepository(Bill)
export class BillRepository extends Repository<Bill> {}