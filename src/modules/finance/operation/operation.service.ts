import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { BaseService, GetParams, GetParamsData } from '../../base-service';
import { OperationRequestDto } from './dto/operation-request.dto';
import { Operation } from './schemas/operation.entity';


@Injectable()
export class OperationService extends BaseService<Operation, GetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой операции';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];
	
	constructor(
		@InjectRepository(Operation)
		protected repository: Repository<Operation>,
	) {
		super();
	}
	
	async create(@Param() requestDto: OperationRequestDto): Promise<Operation> {
	
	}
	
	async update(@Param() id: number, requestDto: OperationRequestDto): Promise<Operation> {
	}
	
}
