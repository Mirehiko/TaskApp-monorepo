import { GetParams, GetParamsData } from '../../../base-service';
import { TaskBehavior, TaskPriority, TaskStatus } from '@finapp/app-common';


export interface TaskGetParamsData extends GetParamsData {
	params: TaskGetParams;
}

export interface TaskGetParams extends GetParams {
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
