import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { GetParamsData } from '../../base-service';
import { Tag } from './schemas/tag.entity';
import { TagTreeRepository } from './tag-repository';
import { TaskTreeRepository } from '../task/task-repository';
import { TagRequestDto } from '@finapp/app-common';
import { User } from '../../common/user/schemas/user.entity';
import { TagGetParams } from './interfaces/tag-params';
import { BaseTreeService } from '../../base-tree-service';


@Injectable()
export class TagService extends BaseTreeService<Tag, GetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такого счета';
  protected entityOrRelationNotFoundMessage: string = '';
  protected relations: string[] = [];

  constructor(
    protected repository: TagTreeRepository,
    protected taskTreeRepository: TaskTreeRepository,
  ) {
    super();
  }

  /**
   * Create new node. If a parent tag defined the tag will be child of this parent tag
   * @param requestDto
   */
  public async createTree(@Param() requestDto: TagRequestDto, author: User = null): Promise<Tag> {
    const tag = new Tag();
    tag.name = requestDto.name;
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
   * Update tag data
   * @param id
   * @param requestDto
   */
  async update(@Param() id: number, requestDto: TagRequestDto, author: User = null): Promise<Tag> {
    const tag = await this.repository.findOne(id);
    if (!tag) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    tag.name = requestDto.name || tag.name;
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
   * Search tags
   * @param paramsData
   */
  async searchTagsBy(paramsData: TagGetParams): Promise<Tag[]> {
    const qb = this.repository.createQueryBuilder('tags')
      .where("tags.name LIKE :text", { text: `%${paramsData.name || ''}%` });

    if (paramsData.createdBy) {
      qb.andWhere('tasks.createdById IN (:createdByIds)', {createdByIds: paramsData.createdBy});
    }
    if (paramsData.createdAt) {
      qb.andWhere('tasks.createdAt BETWEEN :startDate AND :endDate', {
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
