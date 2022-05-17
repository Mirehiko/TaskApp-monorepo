import { GetParams, GetParamsData } from '../../../base-service';
import { TaskStatus } from '@finapp/app-common';


export interface TaskGetParamsData extends GetParamsData {
	params: TaskGetParams;
}

export interface TaskGetParams extends GetParams {
	state?: TaskStatus;
	createdBy?: number[];
	reviewer?: number[];
	assignee?: number[];
	dateDue?: {
		startDate: string;
		endDate: string;
	};
}
