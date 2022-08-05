import { EntityRepository, Repository } from 'typeorm';
import { Bill } from './schemas/bill.entity';
import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { BillRequestDto, IChangeBalance, OperationType } from '@taskapp/app-common';


@EntityRepository(Bill)
export class BillRepository extends Repository<Bill> {
  async changeBalance(id: number, changeBalance: IChangeBalance): Promise<Bill> {
    let bill = await this.findOne(id);

    if (!bill) {
      throw new HttpException('Счет не найден', HttpStatus.NOT_FOUND);
    }

    bill.balance = changeBalance.operationType === OperationType.INC ? bill.balance + changeBalance.value : bill.balance - changeBalance.value;

    try {
      return await this.save(bill);
    }
    catch (e) {
      throw new Error(e);
    }
  }
}
