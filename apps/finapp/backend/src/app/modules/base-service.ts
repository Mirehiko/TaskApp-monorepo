import { MoveDto } from '@finapp/app-common';
import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { FindOneOptions, In, IsNull, Not, Repository } from 'typeorm';
import { TreeEntity } from './base-tree-repository';
import { User } from './common/user/schemas/user.entity';
import { BaseListRepository } from './base-list-repository';


export class BaseService<T, U extends GetParamsData> {
	protected repository: Repository<T>;
	protected entityNotFoundMessage: string;

  /**
   * Get list of entities
   * @param relations
   */
  public async getAll(relations: string[] = []): Promise<T[]> {
    return await this.repository.find({relations});
  }

  /**
   * Get entity by Id
   * @param id
   * @param relations
   */
	public async getByID(id: number, relations: string[] = []): Promise<T> {
		const entity = await this.repository.findOne(id, {relations});
		if (entity) {
			return entity;
		}
		throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
	}

  /**
   * Get entity by
   * @param paramsData
   * @param relations
   */
	public async getBy(@Param() paramsData: U, relations: string[] = []): Promise<T> {
		try {
			const requestObject: FindOneOptions<T> = {
        where: {...paramsData.params}
			};

      requestObject.relations = relations;

			const entity = await this.repository.findOne(requestObject);
			if (entity) {
				return entity;
			}

			if (paramsData.checkOnly) {
				return;
			}

			throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
		}
		catch (e) {
			throw new Error(e);
		}
	}

  /**
   * @param ids
   */
	public async delete(ids: number[]): Promise<any> {
    const entities = await this.repository.find({where: {id: In(ids)}, withDeleted: true});
    if (entities.length) {
      try {
        await this.repository.remove(entities);
        return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
      }
      catch (e) {
        throw new Error(e);
      }
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
	}

  /**
   * Restore deleted entities from trash
   * @param ids
    */
  public async restore(ids: number[]): Promise<any> {
    const entities = await this.repository.find({where: {id: In(ids)}, withDeleted: true});
    if (entities.length) {
      try {
        await this.repository.restore(ids);
        return {status: HttpStatus.OK, statusText: 'Recovered successfully'};
      }
      catch (e) {
        throw new Error(e);
      }
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
  }

  /**
   * Get entities from trash
   */
  async getEntitiesTrash(): Promise<T[]> {
    return await this.repository.find({withDeleted: true, where: {deletedAt: Not(IsNull())}});
  }

  /**
   * Move entities to trash
   * @param ids
   */
  async moveEntitiesToTrash(ids: number[]): Promise<any> {
    const entities = await this.repository.find({where: {id: In(ids)}});
    if (!entities.length) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    try {
      await this.repository.softDelete(ids);
      return {status: HttpStatus.OK, statusText: 'Moved to trash successfully'};
    }
    catch (e) {
      throw new Error(e);
    }
  }

}

export class BaseListService<T extends TreeEntity<T>, U extends GetParamsData> extends BaseService<T, U> {
  protected repository: BaseListRepository<T>;
	protected entityNotFoundMessage: string;

  /**
   *
   * @param moveDto
   * @param author
   */
  async moveTo(moveDto: MoveDto, author: User = null): Promise<void> {
    await this.repository.moveTo(moveDto, author);
  }

  /**
   *
   * @param id
   * @param cls
   * @param editor
   */
  async duplicate(id: number, cls: any, editor: User = null): Promise<T> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await this.repository.duplicate(entity, cls, editor);
  }
}


export interface GetParamsData {
	withRelations?: boolean;
	checkOnly?: boolean;
	params?: GetParams;
}

export interface GetParams {
	id?: number;
	name?: string;
	createdAt?: {
		startDate: string;
		endDate: string;
	};
	updatedAt?: {
		startDate: string;
		endDate: string;
	};
  withDeleted?: boolean;
}
