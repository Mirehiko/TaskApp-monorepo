import { IGetParams, IGetParamsData, TaskBehavior, TaskPriority, TaskStatus } from '@finapp/app-common';


export interface ITaskGetParamsData extends IGetParamsData {
  params: ITaskGetParams;
}

export interface ITaskGetParams extends IGetParams {
  status?: TaskStatus[];
  createdBy?: number[];
  reviewer?: number[];
  assignee?: number[];
  dateDue?: {
    startDate?: string;
    endDate?: string;
  };
  priority?: TaskPriority[];
  taskBehavior?: TaskBehavior;
  list?: number;
  tags?: number[];
}
