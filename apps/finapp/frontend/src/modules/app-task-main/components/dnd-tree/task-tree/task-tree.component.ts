import { Component } from '@angular/core';
import {
  BaseDataChildrenService,
  BaseGroupedTreeService,
  IBaseGroupedTreeData
} from '../../../services/base-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskResponseDto } from '@finapp/app-common';
import { IListItem } from '../../list-module/base-list.component';
import { BaseTreeComponent } from '../base-tree.component';


@Component({
  selector: 'app-task-tree',
  templateUrl: 'task-tree.component.html',
  styleUrls: ['task-tree.component.scss'],
  providers: [BaseDataChildrenService, BaseGroupedTreeService]
})
export class TaskTreeComponent extends BaseTreeComponent<IListItem<TaskResponseDto>> {
  groupStore: IBaseGroupedTreeData<TaskResponseDto>;
  constructor(
    _database: BaseDataChildrenService<TaskResponseDto>,
    db: BaseGroupedTreeService<TaskResponseDto>,
    router: Router,
    activatedRoute: ActivatedRoute,
  ) {
    // super(_database, router, activatedRoute);
    super(_database, db, router, activatedRoute);
  }

  // async divideOnGroups(taskList: TaskResponseDto[]): Promise<void> {
  //   this.db.clear();
  //   if (this.config.groups && this.config.groups.length && this.config.groupDivider) {
  //     this.config.groups.forEach(group => {
  //       const groupInst = new BaseTreeGroupList<TaskResponseDto>(group.name);
  //       const filteredGroupData = this.groupDivider(taskList, group.type);
  //       filteredGroupData.map(item => {
  //         groupInst.insertTo(this.mapDtoToTree(item));
  //       });
  //       this.db.addGroup(groupInst);
  //     });
  //   }
  //   else {
  //     const groupInst = new BaseTreeGroupList<TaskResponseDto>('');
  //     taskList.forEach(item => {
  //       groupInst.insertTo(this.mapDtoToTree(item));
  //     });
  //     this.db.addGroup(groupInst);
  //   }
  // }
  //
  // private mapDtoToTree(item: any): ITreeItem<TaskResponseDto> {
  //   const dataItem: ITreeItem<TaskResponseDto> = {
  //     id: item.id,
  //     data: item,
  //     children: [],
  //   };
  //   this.config.listDescription.map((listDesc: IListItemFieldDescription) => {
  //     if (item?.pinned) {
  //       dataItem.pinned = item.pinned;
  //     }
  //     if (item.children?.length) {
  //       item.children.forEach((child: TaskResponseDto) => {
  //         dataItem.children.push(this.mapDtoToTree(child));
  //       });
  //     }
  //   });
  //   return dataItem;
  // }
}
