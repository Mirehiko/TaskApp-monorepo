import { Injectable } from "@angular/core";
import {
  ITagGetParams,
  ITaskGetParams,
  TagRequestDto,
  TagResponseDto
} from '@taskapp/app-common';
import { HttpClient} from '@angular/common/http';
import { BaseTreeEntityRestService } from './base-tree-entity-rest.service';


@Injectable({ providedIn: "root" })
export class TagRestService extends BaseTreeEntityRestService<TagRequestDto, TagResponseDto, ITagGetParams> {
  constructor(
    http: HttpClient,
  ) {
    super(http, 'tag');
  }
}
