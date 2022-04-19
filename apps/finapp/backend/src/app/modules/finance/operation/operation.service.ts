import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService, GetParamsData } from '../../base-service';
import { OperationRepository } from './operation-repository';
import { Operation } from './schemas/operation.entity';
import { OperationRequestDto, OperationType } from '@finapp/app-common';
import { BillRepository } from '../bill/bill-repository';


@Injectable()
export class OperationService extends BaseService<Operation, GetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой операции';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];

	constructor(
    protected repository: OperationRepository,
    protected billRepository: BillRepository,
	) {
		super();
	}

	async create(@Param() requestDto: OperationRequestDto): Promise<Operation> {
    const bill = await this.repository.findOne({where: {id : requestDto.billId}});
    if (!bill) {
      throw new HttpException('Нет такого счета', HttpStatus.NOT_FOUND);
    }

    try {
      const newOperation = await this.repository.create({});
      return await this.repository.save(newOperation); // 200
    } catch (e) {
      throw new Error(e);
    }
	}

	async update(@Param() id: number, requestDto: OperationRequestDto): Promise<Operation> {
    const operation = await this.repository.findOne({where: {id}});
    if (!operation) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    operation.value = requestDto.value || operation.value;
    operation.comment = requestDto.comment || operation.comment;
    operation.status = requestDto.status || operation.status;

    try {
      await this.repository.save(operation);
      const operationType = operation.type === OperationType.INC || operation.type === OperationType.TRANS_FROM
        ? OperationType.DEC : OperationType.INC;
      await this.billRepository.changeBalance(operation.bill.id, {operationType, value: operation.value});
      return operation;
    }
    catch (e) {
      throw new Error(e);
    }
	}

	async delete(@Param() id: number): Promise<any> {
    const entity = await this.repository.findOne({where: {id}});
    if (!entity) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    try {

      const operationType = entity.type === OperationType.INC || entity.type === OperationType.TRANS_FROM
        ? OperationType.DEC : OperationType.INC;
      await this.billRepository.changeBalance(entity.bill.id, {operationType, value: entity.value});
      await this.repository.remove(entity);
      return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
    }
    catch (e) {
      throw new Error(e);
    }
  }
}
