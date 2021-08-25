import { UserResponse } from './user';
import { TaskStates } from '../enums/task-states';
import { RoleResponse } from './role';

export interface TaskResponse {
  id: number;
  name: string;
  description?: string;
  state: TaskStates;
  assignedTo: UserResponse;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: UserResponse;
  updatedBy?: UserResponse;
  dateDue?: string | Date | boolean;
  config?: TaskConfig;
}

export interface TaskRequest {
  id?: number;
  name: string;
  description: string;
  state: TaskStates;
  assignedTo: UserResponse;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: UserResponse;
  updatedBy: UserResponse;
  dateDue?: string | Date | boolean;
  config: TaskConfig;
}

export class TaskConfig {
  canEditTask: UserResponse[] | RoleResponse[] | boolean;
}