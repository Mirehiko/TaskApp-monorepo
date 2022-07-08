import { IDateRange } from "../../common";
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
  dates?: IDateRange;
  pinned?: boolean;
  tags?: number[];
  list?: number[];
}
