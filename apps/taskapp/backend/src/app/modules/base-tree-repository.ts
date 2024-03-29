import { User } from './common/user/schemas/user.entity';
import { In, TreeRepository } from 'typeorm';
import { MoveDto, TreeEntityType } from '@taskapp/app-common';


export interface TreeEntity<E> {
  id?: number;
  parent: any;
  name: string;
  parent_id: number;
  type: TreeEntityType;
  createdBy?: User;
  updatedBy?: User;
  children?: E[];
  sortOrder: number;
}

export class BaseTreeRepository<T extends TreeEntity<T>> extends TreeRepository<T> {
  async getTreeAsList(relations: string[] = []): Promise<T[]> {
    const tree: T[] = await this.findTrees({relations});
    return this.mapTreeToList(tree);
  }

  public mapTreeToList(tree: T[]): T[] {
    return tree.reduce((ac, i) => {
      ac = i.children?.length ? ac.concat(...this.mapTreeToList(i.children)) : ac;
      i.children = [];
      ac = ac.concat(i);
      return ac;
    }, []);
  }

  /**
   * Move nodes to selected node
   * @param parent
   * @param moveDto
   * @param author
   */
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

  /**
   * Get all children of entity
   * @param entities
   * @param relations
   */
  async getChildrenTreeOfEntity(entities: Array<T>, relations: string[] = []): Promise<T[]> {
    await Promise.all(
      entities.map(async (entity: T) => {
        entity = (await this.manager.getTreeRepository(this.metadata.name).findDescendantsTree(entity, {depth: 1, relations})) as T;
        if (entity.children.length) {
          entity.children = await this.getChildrenTreeOfEntity(entity.children, relations);
        }
        return entity;
      })
    );
    return entities;
  }

  /**
   * Create new tree
   * @param root
   * @param arr
   */
  async rebuildTree(root: T, arr: Array<T>) {
    await Promise.all(
      arr.map((async (value: T) => {
        delete value.id, value.parent, value.parent_id;

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

  copyEntity(entity: T, cls: any): T {
    const copiedEntity = new cls();
    for (const k in copiedEntity) copiedEntity[k] = entity[k as keyof T];
    return copiedEntity;
  }
}
