import { TaskPriority, TaskStatus } from "../enums";


export interface ITaskFilterParams {
  status?: TaskStatus[];
  name?: string;
  assignee?: number[];
  reviewer?: number[];
  createdBy?: number[];
  updatedBy?: number[];
  createdAt?: any;
  priority?: TaskPriority[];
  dates?: {startDate: string, endDate: string};
  pinned?: boolean;
  tags?: number[];
  list?: number[];
}
