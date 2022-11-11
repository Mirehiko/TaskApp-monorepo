import { Injectable } from '@angular/core';
import { ListResponseDto, TagResponseDto } from '@taskapp/app-common';
import { TagRestService } from './rest/tag-rest.service';
import { ListRestService } from './rest/list-rest.service';
import { TaskAppModule } from '../task-app.module';


@Injectable({ providedIn: TaskAppModule })
export class UserDataService {
  public tags: TagResponseDto[] = [];
  public lists: ListResponseDto[] = [];

  constructor(
    private tagRestService: TagRestService,
    private listRestService: ListRestService,
  ) {
    this.initData();
  }


  private async initData(): Promise<void> {
    await this.loadTags();
    await this.loadLists();
  }

  public async loadTags(): Promise<void> {
    this.tags = await this.tagRestService.getList();
  }

  public async loadLists(): Promise<void> {
    this.lists = await this.listRestService.getList();
  }
}
