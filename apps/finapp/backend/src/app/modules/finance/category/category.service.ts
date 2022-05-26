import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { GetParamsData } from '../../base-service';
import { CategoryTreeRepository } from './category-repository';
import { Category } from './schemas/category.entity';
import { CategoryRequestDto } from '@finapp/app-common';
import { UserRepository } from '../../common/user/user-repository';
import { User } from '../../common/user/schemas/user.entity';
import { CategoryGetParams } from './interfaces/category-params';
import { BaseTreeService } from '../../base-tree-service';


@Injectable()
export class CategoryService extends BaseTreeService<Category, GetParamsData> {
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
   */
   public async createTree(@Param() requestDto: CategoryRequestDto, author: User = null): Promise<Category> {
    const tag = new Category();
    tag.name = requestDto.name;
    tag.description = requestDto.description || '';
    tag.createdBy = author;
    tag.updatedBy = author;
    tag.color = requestDto.color || '';
    tag.icon = requestDto.icon || '';
    tag.parent_id = requestDto.parent_id || -1;

    if (requestDto.parent_id !== -1) {
      tag.parent = await this.repository.findOne({where: {id: requestDto.parent_id}});
      return await this.repository.save(tag);
    }
    const createdTag = await this.repository.create(tag);
    return await this.repository.save(createdTag); // 200
  }

  /**
   * Update category data
   * @param id
   * @param requestDto
   */
  async update(@Param() id: number, requestDto: CategoryRequestDto, author: User = null): Promise<Category> {
    const tag = await this.repository.findOne(id);
    if (!tag) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    tag.name = requestDto.name || tag.name;
    tag.description = requestDto.description || '';
    tag.icon = requestDto.icon || tag.icon;
    tag.color = requestDto.color || tag.color;
    tag.updatedBy = author;

    try {
      return await this.repository.save(tag);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Search categories
   * @param paramsData
   */
  async searchCategoriesBy(paramsData: CategoryGetParams): Promise<Category[]> {
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
