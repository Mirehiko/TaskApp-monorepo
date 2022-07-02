import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskRequestDto, TaskResponseDto } from '@finapp/app-common';
import { TaskRestService } from '../services/rest/task-rest.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: 'task-detail.component.html',
  styleUrls: ['task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  public taskIn: TaskResponseDto;
  private taskOut: TaskRequestDto;
  public dataLoaded: boolean = false;

  constructor(
    private taskRestService: TaskRestService,
    private route: ActivatedRoute,
  ){
    
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData(): Promise<void> {
    
    this.dataLoaded = false;
    console.log(this.route.snapshot.params['taskId'], this.route.snapshot.params)
    this.taskIn = await this.taskRestService.getById(this.route.snapshot.params['taskId']);
    console.log(this.taskIn)
    this.dataLoaded = true;
  }

}
