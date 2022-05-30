import { User } from './common/user/schemas/user.entity';
import { In, Repository } from 'typeorm';
import { TreeEntity } from './base-tree-repository';
import { MoveDto } from '@finapp/app-common';


export class BaseListRepository<T extends TreeEntity<T>> extends Repository<T> {
  async moveTo(moveDto: MoveDto, author: User = null): Promise<void> {
    const parent = await this.findOne({ where: { id: moveDto.parentId } });
    let entities = await this.find({ where: { id: In(moveDto.childIds) } });
    entities = entities.map(child => {
      child.parent = parent;
      child.parent_id = parent.id;
      child.updatedBy = author;
      return child;
    })
    await this.manager.save(entities);
  }

  async duplicate(entity: T, cls: any, editor: User = null): Promise<T> {
    const copy = this.copyEntity(entity, cls);
    delete copy.id;
    copy.name += ' copy';
    copy.createdBy = editor;
    copy.updatedBy = editor;

    const result = (await this.manager.getRepository(this.metadata.name).create({ ...copy })) as T;
    return await this.manager.save(result);
  }

  copyEntity(entity: T, cls: any): T {
    const copiedEntity = new cls();
    for(const k in entity) copiedEntity[k] = entity[k];
    return copiedEntity;
  }
}
