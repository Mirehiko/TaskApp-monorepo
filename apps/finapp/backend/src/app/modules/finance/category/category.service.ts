import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { FindOneOptions, In, Repository } from 'typeorm';
import { BaseService, GetParams, GetParamsData } from '../../base-service';
import { CategoryRepository } from './category-repository';
import { Category } from './schemas/category.entity';
import { CategoryRequestDto, TaskRequestDto } from '@finapp/app-common';
import { Task } from '../../tasks/task/schemas/task.entity';
import { UserRepository } from '../../common/user/user-repository';


@Injectable()
export class CategoryService extends BaseService<Category, GetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такого счета';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];

	constructor(
		protected repository: CategoryRepository,
    protected userRepository: UserRepository,
	) {
		super();
	}

  public async create(@Param() requestDto: CategoryRequestDto): Promise<Category> {
    const newCategory = new Category();
    newCategory.description = requestDto.description;
    newCategory.icon = requestDto.icon || '';
    newCategory.name = requestDto.name;
    newCategory.color = requestDto.color || '';

    // TODO: Set current users as author
    // newTask.createdBy = requestDto.status;
    // newTask.updatedBy = requestDto.status;

    const createdCategory = await this.repository.create(newCategory);
    return await this.repository.save(createdCategory); // 200
  }

	async update(@Param() id: number, requestDto: CategoryRequestDto): Promise<Category> {
    const category = new Category();
    if (!category) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    category.description = requestDto.description || requestDto.description;
    category.name = requestDto.name || category.name;
    category.icon = requestDto.icon || category.icon;
    category.color = requestDto.color || category.color;

    return await this.repository.save(category); // 200
	}

	async moveTasksTo(id: number, ids: number[]): Promise<void> {

  }

  async deleteMultiple(ids: number): Promise<any> {

  }

}
