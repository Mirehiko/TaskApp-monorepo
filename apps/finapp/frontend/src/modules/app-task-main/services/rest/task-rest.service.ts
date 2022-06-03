import { Injectable } from "@angular/core";
import { AuthResponseDto, AuthUserDto, TaskRequestDto, TaskResponseDto, UserResponseDto } from '@finapp/app-common';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { response } from 'express';
import { Subscription } from 'rxjs';


@Injectable({ providedIn: "root" })
export class TaskRestService {
  private baseUrl = 'http://localhost:5000/api/main';

  constructor(
    private http: HttpClient,
  ) {
  }

  public async create(taskRequestDto: TaskRequestDto): Promise<TaskResponseDto> {
    return new TaskResponseDto();
  }

  public async update(taskId: number, taskRequestDto: TaskRequestDto): Promise<TaskResponseDto> {
    return new Promise<TaskResponseDto>( (ok, fail) => {
      const sub = new Subscription();

      sub.add(
        this.http.patch(`${this.baseUrl}/task/${taskId}`, taskRequestDto).subscribe(res => {
          if (sub) {
            sub.unsubscribe();
          }
          ok(res as TaskResponseDto)
        }, (error) => {
          if (sub) {
            sub.unsubscribe();
          }
          fail(error);
        })
      );
    })

  }

  public async getById(taskId: number): Promise<void> {
    // return new TaskResponseDto();
  }

  public async getList(): Promise<void> {
    // return new TaskResponseDto();
  }

  public async search(authUserDto: AuthUserDto): Promise<void> {
    // return new TaskResponseDto();
  }

  public async move(targetId: number = -1, taskIds: number[]): Promise<void> {
  }

  public async copy(targetId: number = -1, taskIds: number[]): Promise<void> {
  }

  public async deleteTask(taskId: number): Promise<void> {
    // return new TaskResponseDto();
  }

  public async deleteTasks(taskIds: number[]): Promise<void> {
    // return new TaskResponseDto();
  }

  public async moveTaskToTrash(taskId: number): Promise<void> {
  }

  public async moveTasksToTrash(taskIds: number[]): Promise<void> {
  }

  public async restore(taskId: number): Promise<void> {
  }

  public async restoreTasks(taskIds: number[]): Promise<void> {
  }

}
