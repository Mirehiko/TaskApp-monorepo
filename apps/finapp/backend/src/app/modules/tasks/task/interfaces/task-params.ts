import { TaskStates } from '../../../../shared/enums/task/task-states';
import { GetParams, GetParamsData } from '../../../base-service';


export interface TaskGetParamsData extends GetParamsData {
	params: TaskGetParams;
}

export interface TaskGetParams extends GetParams {
	state?: TaskStates;
	createdBy?: number[];
	reviewer?: number[];
	assignee?: number[];
	dateDue?: {
		startDate: string;
		endDate: string;
	};
}