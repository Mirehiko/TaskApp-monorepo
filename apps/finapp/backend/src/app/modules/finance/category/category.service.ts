import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { BaseService, GetParams, GetParamsData } from '../../base-service';
import { CategoryRepository } from './category-repository';
import { Category } from './schemas/category.entity';
import { CategoryRequestDto } from '@finapp/app-common';


@Injectable()
export class CategoryService extends BaseService<Category, GetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такого счета';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];

	constructor(
		protected repository: CategoryRepository,
	) {
		super();
	}

	async create(@Param() requestDto: CategoryRequestDto): Promise<Category> {
		return new Category();
	}

	async update(@Param() id: number, requestDto: CategoryRequestDto): Promise<Category> {
		return new Category();
	}

}
