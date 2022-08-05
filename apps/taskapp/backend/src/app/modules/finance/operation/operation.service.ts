import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService } from '../../base-service';
import { OperationRepository } from './operation-repository';
import { Operation } from './schemas/operation.entity';
import { IGetParamsData, OperationRequestDto, OperationType } from '@taskapp/app-common';
import { BillRepository } from '../bill/bill-repository';
import { In } from 'typeorm';


@Injectable()
export class OperationService extends BaseService<Operation, IGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой операции';
	protected entityOrRelationNotFoundMessage: string = '';

	constructor(
    protected repository: OperationRepository,
    protected billRepository: BillRepository,
	) {
		super();
	}

  /**
   *
   * @param requestDto
   */
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

  /**
   *
   * @param id
   * @param requestDto
   */
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

	async delete(@Param() ids: number[]): Promise<any> {
    const entities = await this.repository.find({where: {id: In(ids)}});
    if (!entities) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    try {
      // TODO: переписать для массива
      const operationType = entities[0].type === OperationType.INC || entities[0].type === OperationType.TRANS_FROM
        ? OperationType.DEC : OperationType.INC;
      await this.billRepository.changeBalance(entities[0].bill.id, {operationType, value: entities[0].value});
      await this.repository.remove(entities[0]);
      return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
    }
    catch (e) {
      throw new Error(e);
    }
  }
}
