import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CategoryTreeRepository } from './category-repository';
import { Category } from './schemas/category.entity';
import { CategoryRequestDto, ICategoryGetParams, IGetParamsData } from '@finapp/app-common';
import { UserRepository } from '../../common/user/user-repository';
import { User } from '../../common/user/schemas/user.entity';
import { BaseTreeService } from '../../base-tree-service';


@Injectable()
export class CategoryService extends BaseTreeService<Category, IGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такого счета';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];

	constructor(
		protected repository: CategoryTreeRepository,
    protected userRepository: UserRepository,
	) {
		super();
	}

  /**
   * Create new node. If a parent category defined the category will be child of this parent category
   * @param requestDto
   * @param author
   */
  public async createTree(@Param() requestDto: CategoryRequestDto, author: User = null): Promise<Category> {
    const category = new Category();
    category.name = requestDto.name;
    category.description = requestDto.description || '';
    category.createdBy = author;
    category.updatedBy = author;
    category.color = requestDto.color || '';
    category.icon = requestDto.icon || '';
    category.parent_id = requestDto.parent_id || -1;

    if (requestDto.parent_id && requestDto.parent_id !== -1) {
      category.parent = await this.repository.findOne({where: {id: requestDto.parent_id}});
      category.color = category.color ? category.color : category.parent.color;
      return await this.repository.save(category);
    }
    const createdCategory = await this.repository.create(category);
    return await this.repository.save(createdCategory); // 200
  }

  /**
   * Update category data
   * @param id
   * @param requestDto
   * @param author
   */
  async update(@Param() id: number, requestDto: CategoryRequestDto, author: User = null): Promise<Category> {
    const category = await this.repository.findOne(id);
    if (!category) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    category.name = requestDto.name || category.name;
    category.description = requestDto.description || '';
    category.icon = requestDto.icon || category.icon;
    category.color = requestDto.color || category.color;
    category.updatedBy = author;

    try {
      return await this.repository.save(category);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Search categories
   * @param paramsData
   */
  async searchCategoriesBy(paramsData: ICategoryGetParams): Promise<Category[]> {
    const qb = this.repository.createQueryBuilder('category')
      .where("CONCAT(tasks.name, ' ', tasks.description) LIKE :text", { text: `%${paramsData.name || ''}%` });

    if (paramsData.createdBy) {
      qb.andWhere('category.createdById IN (:createdByIds)', {createdByIds: paramsData.createdBy});
    }
    if (paramsData.createdAt) {
      qb.andWhere('category.createdAt BETWEEN :startDate AND :endDate', {
        startDate: paramsData.createdAt.startDate,
        endDate: paramsData.createdAt.endDate
      });
    }
    if (paramsData.withDeleted) {
      qb.withDeleted();
    }

    return await qb.getMany();
  }

}
