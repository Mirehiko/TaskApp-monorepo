import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { FindOneOptions, In, Repository } from 'typeorm';
import { BaseTreeRepository, TreeEntity } from './base-tree-repository';
import { User } from './common/user/schemas/user.entity';


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

export class BaseTreeService<T extends TreeEntity<T>, U extends GetParamsData> {
  protected repository: BaseTreeRepository<T>;
  protected relations: string[];
  protected entityNotFoundMessage: string;

  /**
   *
   */
  public async getAllTrees(): Promise<T[]> {
    return await this.repository.findTrees({relations: this.relations});
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

  public async copyTree(id: number, nodeIds: number[], editor: User,  relations: string[] = []): Promise<T[]> {
    let entity = null;
    if (id !== -1) {
      entity = await this.repository.findOne(id);
      if (!entity) {
        throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
      }
    }
    let entities = await this.repository.find({where: {id: In(nodeIds)}, relations: relations});
    if (!entities.length) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    // TODO: Check logic using default method .findDescendantsTree()
    entities = await this.repository.getChildrenTreeOfEntity(entities, relations);
    const copiedTrees = await this.copyTreeNodes(entities, editor);

    await this.repository.rebuildTree(entity, copiedTrees);

    return await this.getAllTrees();
  }

  copyEntity(entity: T): T{return entity};

  /**
   * Copy tree nodes
   * @param node
   * @param editor
   */
  async copyTreeNodes(nodes: Array<T>, editor: User): Promise<T[]> {
    const newTrees: T[] = [];
    await Promise.all(
      nodes.map((async (value: T, index: number) => {
        const newNode: T = this.copyEntity(value);
        newNode.createdBy = newNode.updatedBy = editor;
        if (value.children && value.children.length > 0) {
          newNode.children = await this.copyTreeNodes(value.children, editor);
        }
        newTrees.push(newNode);
        return value;
      }))
    );
    return newTrees;
  }

  /**
   * Delete entities with children
   * @param id
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
}
