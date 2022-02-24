import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { BaseService, GetParams, GetParamsData } from '../../base-service';
import { Category } from './schemas/category.entity';
import { CategoryRequestDto } from './dto/category-request.dto';


@Injectable()
export class CategoryService extends BaseService<Category, GetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такого счета';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];
	
	constructor(
		@InjectRepository(Category)
		protected repository: Repository<Category>,
	) {
		super();
	}
	
	async create(@Param() requestDto: CategoryRequestDto): Promise<Category> {
	
	}
	
	async update(@Param() id: number, requestDto: CategoryRequestDto): Promise<Category> {
	}
	
}
