import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ListResponseDto, TagResponseDto } from '@taskapp/app-common';
import { TagRestService } from '../services/rest/tag-rest.service';
import { ListRestService } from '../services/rest/list-rest.service';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class NavigableTaskPageService {
  private _pageMenuGroups: any[] = [];
  public tags: TagResponseDto[] = [];
  public lists: ListResponseDto[] = [];
  public $tags: Subject<TagResponseDto[]> = new Subject();
  public $lists: Subject<ListResponseDto[]> = new Subject();
  public selectedTags: number[] = [];
  public selectedLists: number[] = [];


  constructor(
    private tagRestService: TagRestService,
    private listRestService: ListRestService,
    private router: Router,
  ) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    await this.getTags();
    await this.getLists();
  }

  public get menu(): any {
    return this._pageMenuGroups;
  }

  async getTags(): Promise<TagResponseDto[]> {
    this.tags = await this.tagRestService.getList();
    this.$tags.next(this.tags);
    return this.tags;
  }

  async getLists(): Promise<ListResponseDto[]> {
    this.lists = await this.listRestService.getList();
    this.$lists.next(this.lists);
    return this.lists;
  }
}
