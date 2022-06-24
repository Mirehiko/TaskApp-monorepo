import { Injectable } from '@angular/core';
import { TagRestService } from '../../services/rest/tag-rest.service';
import { ListRestService } from '../../services/rest/list-rest.service';
import { Router } from '@angular/router';
import { ListResponseDto, TagResponseDto } from '@finapp/app-common';


@Injectable()
export class NavigableTaskPageService {
  private _pageMenuGroups: any[] = [];

  constructor(
    private tagRestService: TagRestService,
    private listRestService: ListRestService,
    private router: Router,
  ) {
  }

  async initialize(): Promise<void> {
    const tags = this.getTags();
    const lists = this.getLists();
  }

  public get menu(): any {
    return this._pageMenuGroups;
  }

  async getTags(): Promise<TagResponseDto[]> {
    return await this.tagRestService.getList();
  }

  async getLists(): Promise<ListResponseDto[]> {
    return await this.listRestService.getList();
  }

}
