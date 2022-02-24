import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { BaseService, GetParams, GetParamsData } from '../../base-service';
import { BillRequestDto } from './dto/bill-request.dto';
import { Bill } from './schemas/bill.entity';


@Injectable()
export class BillService extends BaseService<Bill, GetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такого счета';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];
	
	constructor(
		@InjectRepository(Bill)
		protected repository: Repository<Bill>,
	) {
		super();
	}
	
	async create(@Param() requestDto: BillRequestDto): Promise<Bill> {
		return new Bill();
	}
	
	async update(@Param() id: number, requestDto: BillRequestDto): Promise<Bill> {
		return new Bill();
	}
	
}


