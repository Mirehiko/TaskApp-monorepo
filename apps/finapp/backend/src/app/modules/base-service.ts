import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { FindOneOptions, getManager, Repository, TreeRepository } from 'typeorm';


export class BaseService<T, U extends GetParamsData> {
	protected repository: Repository<T>;
	protected relations: string[];
	protected entityNotFoundMessage: string;

	public async getAll(): Promise<T[]> {
		return await this.repository.find();
	}

  public async getAllRelations(): Promise<T[]> {
    return await this.repository.find({relations: this.relations});
  }

	public async getByID(id: number): Promise<T> {
		const entity = await this.repository.findOne({where: {id}, relations: this.relations});
		if (entity) {
			return entity;
		}
		throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
	}

	public async getBy(@Param() paramsData: U): Promise<T> {
		try {
			const requestObject: FindOneOptions<T> = {
        where: {...paramsData.params}
			};

			if (paramsData.withRelations) {
				requestObject.relations = this.relations;
			}

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

	public async delete(id: number): Promise<any> {
    const entity = await this.repository.findOne({where: {id}});
    if (entity) {
      try {
        await this.repository.remove(entity);
        return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
      }
      catch (e) {
        throw new Error(e);
      }
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
	}
}

export class BaseTreeService<T, U extends GetParamsData> {
  protected repository: TreeRepository<T>;
  protected relations: string[];
  protected entityNotFoundMessage: string;

  public async getAllTrees(): Promise<T[]> {
    return await this.repository.findTrees();
  }

  public async getTreesBy(): Promise<T[]> {
    return [];
  }

  public async getTreeByID(id: number): Promise<T> {
    const entity = await this.repository.findOne({where: {id}});
    if (entity) {
      await this.repository.findDescendantsTree(entity, {depth: 2 });
      return entity;
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
  }

  public async delete(id: number): Promise<any> {
    const entity = await this.repository.findOne({where: {id}});
    if (entity) {
      try {
        await this.repository.remove(entity);
        return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
      }
      catch (e) {
        throw new Error(e);
      }
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
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
	relations?: string[];
}
