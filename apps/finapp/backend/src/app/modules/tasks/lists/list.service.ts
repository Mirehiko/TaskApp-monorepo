import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseListService } from '../../base-service';
import { ListRepository } from './list-repository';
import { TaskTreeRepository } from '../task/task-repository';
import { List } from './schemas/list.entity';
import { User } from '../../common/user/schemas/user.entity';
import { IListGetParams, IListGetParamsData, ListBehaviorType, ListRequestDto, ListType } from '@finapp/app-common';


@Injectable()
export class ListService extends BaseListService<List, IListGetParamsData, ListRepository> {
  protected entityNotFoundMessage: string = 'Нет такого счета';
  protected entityOrRelationNotFoundMessage: string = '';

  constructor(
    protected taskTreeRepository: TaskTreeRepository,
  ) {
    super();
  }

  /**
   *
   * @param requestDto
   * @param author
   */
  public async create(@Param() requestDto: ListRequestDto, author: User = null): Promise<List> {
    const list = new List();
    list.name = requestDto.name;
    list.createdBy = author;
    list.updatedBy = author;
    list.color = requestDto.color || '';
    list.description = requestDto.description || '';
    list.archived = requestDto.archived || false;
    list.behavior_type = requestDto.behavior_type || ListBehaviorType.PERSONAL;
    list.icon = requestDto.icon || '';
    list.parent_id = requestDto.parent_id || -1;
    list.type = requestDto.type || ListType.LIST;

    if (requestDto.parent_id && requestDto.parent_id !== -1) {
      list.parent = await this.repository.findOne({where: {id: requestDto.parent_id}});
      list.color = list.color ? list.color : list.parent?.color;
      return await this.repository.save(list);
    }
    const createdList = await this.repository.create(list);
    return await this.repository.save(createdList); // 200
  }

  /**
   * Update list data
   * @param id
   * @param requestDto
   * @param author
   */
  async update(@Param() id: number, requestDto: ListRequestDto, author: User = null): Promise<List> {
    const list = await this.repository.findOne(id);
    if (!list) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    list.name = requestDto.name || list.name;
    list.description = requestDto.description || list.description;
    list.icon = requestDto.icon || list.icon;
    list.color = requestDto.color || list.color;
    list.archived = requestDto.archived || list.archived;
    list.behavior_type = requestDto.behavior_type || list.behavior_type;
    list.updatedBy = author;

    try {
      return await this.repository.save(list);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Search lists
   * @param paramsData
   */
  async searchListsBy(paramsData: IListGetParams): Promise<List[]> {
    const qb = this.repository.createQueryBuilder('lists')
      .where("lists.name LIKE :text", { text: `%${paramsData.name || ''}%` });

    if (paramsData.createdBy) {
      qb.andWhere('lists.createdById IN (:createdByIds)', {createdByIds: paramsData.createdBy});
    }
    if (paramsData.createdAt) {
      qb.andWhere('lists.createdAt BETWEEN :startDate AND :endDate', {
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
