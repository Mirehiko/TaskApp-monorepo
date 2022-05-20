import { User } from './common/user/schemas/user.entity';
import { In, TreeRepository } from 'typeorm';
import { MoveDto } from '@finapp/app-common';


export interface TreeEntity<E> {
  id?: number;
  parent: any;
  name: string;
  parent_id: number;
  createdBy?: User;
  updatedBy?: User;
  children?: E[];
  parentId?: number;
  mpath?: string;
}

export class BaseTreeRepository<T extends TreeEntity<T>> extends TreeRepository<T> {
  async moveTo(parent: T, moveDto: MoveDto, author: User = null): Promise<void> {
    let children = await this.find({ where: { id: In(moveDto.childIds) } });
    children = children.map(child => {
      child.parent = parent;
      child.parent_id = parent.id;
      child.updatedBy = author;
      return child;
    })
    await this.manager.save(children);
  }

  async getTreeOfEntities(entities: Array<T>, relations: string[] = []): Promise<T[]> {
    await Promise.all(
      entities.map(async (entity: T) => {
        entity = (await this.manager.getTreeRepository(this.metadata.name).findDescendantsTree(entity, {relations})) as T;
        if (entity.children.length) {
          entity.children = await this.getTreeOfEntities(entity.children, relations);
        }
        return entity;
      })
    );
    return entities;
  }

  async rebuildTree(root: T, arr: Array<T>) {
    await Promise.all(
      arr.map((async (value: T) => {
        delete value.id;
        value.name += ' copy';
        const result = (await this.manager.getTreeRepository(this.metadata.name).create({ ...value })) as T;
        result.parent = root;
        result.parent_id = root ? root.id : -1;
        await this.manager.save(result);

        if (value.children && value.children.length > 0) {
          await this.rebuildTree(result, value.children);
        }
      }))
    );
  }
}