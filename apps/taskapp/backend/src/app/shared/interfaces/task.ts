// import { UserResponse } from './operation';
// import { TaskStatus } from '../enums/task/task-states';
// import { RoleResponse } from './category';
//
// export interface TaskResponse {
//   id: number;
//   name: string;
//   description?: string;
//   state: TaskStatus;
//   assignedTo: UserResponse;
//   createdAt?: string | Date;
//   updatedAt?: string | Date;
//   createdBy?: UserResponse;
//   updatedBy?: UserResponse;
//   dateDue?: string | Date | boolean;
//   config?: TaskConfig;
// }
//
// export interface TaskRequest {
//   id?: number;
//   name: string;
//   description: string;
//   state: TaskStatus;
//   assignedTo: UserResponse;
//   createdAt: string | Date;
//   updatedAt: string | Date;
//   createdBy: UserResponse;
//   updatedBy: UserResponse;
//   dateDue?: string | Date | boolean;
//   config: TaskConfig;
// }
//
// export class TaskConfig {
//   canEditTask: UserResponse[] | RoleResponse[] | boolean;
// }
