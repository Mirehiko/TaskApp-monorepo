import { Injectable } from '@angular/core';
import { TagRequestDto, TagResponseDto } from '@taskapp/app-common';
import { TagRestService } from './rest/tag-rest.service';
import { TaskAppModule } from '../task-app.module';
import { BaseTreeDatabaseService } from './base-data.service';
import { ITreeItem } from '../components/list-module/base-list.component';
import { TagTreeHelper } from '../helpers/task-helpers';


@Injectable({ providedIn: TaskAppModule })
export class TagDataService{
  public tagsDB: BaseTreeDatabaseService<TagResponseDto> = new BaseTreeDatabaseService<TagResponseDto>();

  constructor(
    private tagRestService: TagRestService,
  ) {
    this.loadTags();
  }

  private async initData(): Promise<void> {
    await this.loadTags();
  }

  public async createTag(tag: TagRequestDto): Promise<void> {
    const createdTag = await this.tagRestService.create(tag);
    await this.loadTags();
  }

  public async updateTag(id: number, tag: TagRequestDto): Promise<void> {
    const updatedTag = await this.tagRestService.update(id, tag);
    await this.loadTags();
    // this.tagsDB.up
  }

  public async deleteTags(tags: ITreeItem<TagResponseDto>[]): Promise<void> {
    await this.tagRestService.deleteTags(tags.map(i => i.id));
    tags.forEach(i => this.tagsDB.removeItem(i));
  }

  public async loadTags(): Promise<void> {
    const tags = await this.tagRestService.getList();
    this.tagsDB.initialize(await TagTreeHelper.mapDtoToTree(tags));
  }
}
