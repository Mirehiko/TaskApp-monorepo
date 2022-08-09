import { IGetParamsData, MoveDto } from '@taskapp/app-common';
import { HttpException, HttpStatus } from "@nestjs/common";
import { In, Not, IsNull } from "typeorm";
import { TreeEntity, BaseTreeRepository } from "./base-tree-repository";
import { User } from "./common/user/schemas/user.entity";


export class BaseTreeService<T extends TreeEntity<T>, U extends IGetParamsData> {
  protected repository: BaseTreeRepository<T>;
  protected entityNotFoundMessage: string;

  /**
   *
   * @param relations
   */
  public async getAllTrees(relations: string[] = []): Promise<T[]> {
    return await this.repository.findTrees({ relations });
  }

  /**
   * Get entity tree by id with relations
   * @param id
   * @param relations
   */
  public async getTreeByID(id: number, depth: number, relations: string[] = []): Promise<T> {
    const entity = await this.repository.findOne(id, { relations });
    if (entity) {
      entity.children = depth !== null
        ? (await this.repository.findDescendantsTree(entity, {depth})).children
        : (await this.repository.findDescendantsTree(entity)).children;
      return entity;
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
  }

  /**
   * Get entity by id with relations
   * @param id
   * @param relations
   */
  public async getByID(id: number, relations: string[] = []): Promise<T> {
    const entity = await this.repository.findOne(id, { relations });
    if (entity) {
      return entity;
    }
    throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
  }

  /**
   *
   * @param id
   * @param nodeIds
   * @param cls
   * @param editor
   * @param relations
   */
  public async copyTree(id: number, nodeIds: number[], cls: any, editor: User, relations: string[] = []): Promise<T[]> {
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
    const copiedTrees = await this.copyTreeNodes(entities, cls, editor);

    await this.repository.rebuildTree(entity, copiedTrees);

    return await this.getAllTrees();
  }

  /**
   * Move selected entities to the entity
   * @param moveDto
   * @param author
   */
  async moveTo(moveDto: MoveDto, author: User = null): Promise<void> {
    const parent = await this.repository.findOne(moveDto.parentId);
    if (!parent) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    await this.repository.moveTo(parent, moveDto, author);
  }

  /**
   * Copy tree nodes
   * @param nodes
   * @param cls
   * @param editor
   */
  async copyTreeNodes(nodes: Array<T>, cls: any, editor: User): Promise<T[]> {
    const newTrees: T[] = [];
    await Promise.all(
      nodes.map((async (value: T, index: number) => {
        const newNode: T = this.repository.copyEntity(value, cls);
        newNode.createdBy = newNode.updatedBy = editor;
        if (value.children && value.children.length > 0) {
          newNode.children = await this.copyTreeNodes(value.children, cls, editor);
        }
        newTrees.push(newNode);
        return value;
      }))
    );
    return newTrees;
  }

  /**
   * Delete entities with children
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
