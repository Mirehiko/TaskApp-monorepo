import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskRequestDto, TaskResponseDto } from '@taskapp/app-common';
import { TaskRestService } from '../services/rest/task-rest.service';
import { BaseDetailPage } from '../components/base-detail-page';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreService } from '../services/core.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-task-detail',
  templateUrl: 'task-detail.component.html',
  styleUrls: ['task-detail.component.scss'],
})
export class TaskDetailComponent extends BaseDetailPage implements OnInit, OnDestroy {
  public form: FormGroup;
  public taskIn: TaskResponseDto;
  private taskOut: TaskRequestDto;
  public baseUrl: string = '/taskapp/ttp/';
  public parentLink: string;
  public placeholderText: string = 'Description';
  // public dataLoaded: boolean = false;
  constructor(
    injector: Injector,
    public core: CoreService,
    private taskRestService: TaskRestService,
    private route: ActivatedRoute,
    private router: Router,
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
    }


  }

  public navigate(url: string): void {
    this.router.navigate([url]);
  }
}
