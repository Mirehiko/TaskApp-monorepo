import { Injectable } from '@angular/core';
import { ListResponseDto, TagResponseDto, TaskResponseDto } from '@finapp/app-common';
import { BaseDataChildrenService } from '../services/base-data.service';


@Injectable()
export class TaskModuleService {
  public tasks: TaskResponseDto[] = [];
  public tags: TagResponseDto[] = [];
  public lists: ListResponseDto[] = [];

  constructor(
    public taskDataService: BaseDataChildrenService<TaskResponseDto>,
    public tagDataService: BaseDataChildrenService<TagResponseDto>,
    public listDataService: BaseDataChildrenService<ListResponseDto>,
  ) {
  }

}

