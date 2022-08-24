import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagRequestDto, TagResponseDto, TaskRequestDto, TaskResponseDto } from '@taskapp/app-common';
import { TaskRestService } from '../services/rest/task-rest.service';
import { BaseDetailPage } from '../components/base-detail-page';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreService } from '../services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { IActionListItem, IListItemAction, ITreeItem } from '../components/list-module/base-list.component';
import { taskListConfig } from './task-tree-config';
import { TaskListMenuAction } from '../task-common/task-common';
import { TaskTreeHelper } from '../helpers/task-helpers';
import { TagRestService } from '../services/rest/tag-rest.service';


@Component({
  selector: 'app-task-detail',
  templateUrl: 'task-detail.component.html',
  styleUrls: ['task-detail.component.scss'],
})
export class TaskDetailComponent extends BaseDetailPage implements OnInit, OnDestroy {
  public taskListConfig = taskListConfig;
  public form: FormGroup;
  public taskIn: TaskResponseDto;
  private taskOut: TaskRequestDto;
  public baseUrl: string = '/taskapp/ttp/';
  public parentLink: string;
  public placeholderText: string = 'Description';
  public children: ITreeItem<TaskResponseDto>[] = [];
  public taskTags: TagResponseDto[] = [];
  public menuItems: IActionListItem<TaskListMenuAction>[] = [];
  public notAssignedTags: TagResponseDto[] = [];
  public filteredTags: TagResponseDto[] = [];

  // public dataLoaded: boolean = false;
  constructor(
    injector: Injector,
    public core: CoreService,
    private taskRestService: TaskRestService,
    private route: ActivatedRoute,
    private router: Router,
    private tagRestService: TagRestService,
  ){
    super(injector);
  }

  ngOnDestroy(): void {
    this.destroy();
    // TODO: destroy
  }

  ngOnInit(): void {
  }

  protected async initData(): Promise<void> {
    this.parentLink = '';
    await this.getData();

    if (this.taskIn.parent_id !== -1) {
      this.parentLink = this.baseUrl + this.taskIn.parent_id;
    }

    await this.initForm();
  }

  private async initForm(): Promise<void> {
    this.form = new FormGroup({
      name: new FormControl(this.taskIn.name || ''),
      description: new FormControl(this.taskIn.description || ''),
    });
  }

  public async save(): Promise<void> {
    await this.saveHandler(async () => {
      this.taskOut = new TaskRequestDto();
      this.taskOut.name = this.form?.get('name')?.value!;
      this.taskOut.description = this.form?.get('description')?.value;
      console.log(this.taskOut, this.form.value, this.taskIn)
      await this.taskRestService.update(this.taskIn.id, this.taskOut);
    });
  }

  private async getData(): Promise<void> {
    if (this.isNew) {
      this.taskIn = new TaskResponseDto();
    }
    else {
      this.taskIn = await this.taskRestService.getById(this.params.routeParams['taskId']);
      const children = await this.taskRestService.getChildrenById(this.params.routeParams['taskId']);
      this.children = await TaskTreeHelper.mapDtoToTree(children);
    }
    this.taskTags = this.taskIn.tags;
    const tags = await this.tagRestService.getList();
    const taskTagIds = this.taskTags.map(t => t.id);
    this.notAssignedTags = tags.filter(t => !taskTagIds.includes(t.id));
    this.searchTagByString('');
  }

  public onMenuAction(action: IListItemAction): void {
    console.log(action)
  }

  public navigate(url: string): void {
    this.router.navigate([url]);
  }

  public searchByTag(tag: TagResponseDto): void {
    // TODO: navigate and search by tag
    // this.navigate([''])
  }

  public searchTagByString(name: string): void {
    this.filteredTags = this.notAssignedTags.filter(t => t.name.toLowerCase().includes(name.toLowerCase()));
    if (this.filteredTags.length === 0) {
      this.filteredTags.push({
        id: -1,
        name: `Создать тег '${name}'`,
        children: [],
        color: '',
        icon: '',
        parent_id: -1
      });
    }
  }

  public async addTag(tag: TagResponseDto): Promise<void> {
    if (tag.id === -1) {
      await this.createNewTagAndAttachToTask({
        name: tag.name?.match(/\'(.*)\'/)?.pop() as string,
        icon: '',
        color: '',
        parent_id: -1
      });
      return;
    }
    await this.taskRestService.addTaskTags(this.taskIn.id, [tag.id]);
    this.taskTags.push(tag);
    this.notAssignedTags = this.notAssignedTags.filter(t => t.id !== tag.id);
    this.filteredTags = this.notAssignedTags;
  }

  private async createNewTagAndAttachToTask(tmpTag: TagRequestDto): Promise<void> {
    const tag = await this.tagRestService.create(tmpTag);
    await this.addTag(tag);
  }

  public async removeTag(tag: TagResponseDto): Promise<void> {
    if (this.isNew) {

    }
    else {
      await this.taskRestService.removeTaskTags(this.taskIn.id, [tag.id]);
    }
    this.taskTags = this.taskTags.filter(t => t.id !== tag.id);
    this.notAssignedTags.push(tag);
    this.filteredTags = this.notAssignedTags;
  }
}
