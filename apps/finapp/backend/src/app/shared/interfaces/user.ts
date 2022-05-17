import {PermissionResponse} from "./permission";
import { RoleResponse } from './role';
import { Themes } from '../enums/common/themes';
import { TaskStatus } from '@finapp/app-common';


export interface UserResponse {
  id: number;
  name: string;
  email?: string;
  role?: RoleResponse;
  permissions?: PermissionResponse[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: UserResponse | null;
  config?: UserConfig;
}

export interface UserRequest {
  id?: number;
  name: string;
  email: string;
  role: RoleResponse;
  permissions?: PermissionResponse[];
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy: UserResponse | null;
  config?: UserConfig;
  password?: string;
  repassword?: string;
}

// export type ThemeStrings = keyof typeof Themes;
export class UserConfig {
  showedStatuses: TaskStatus[];
  // showedStatuses: ThemeStrings[];
  theme: Themes;

  canSeeProfiles: UserResponse[] | boolean;
  canSeeMyProfile: UserResponse[] | boolean;
  canSeeTasks: UserResponse[] | boolean;
  canSeeMyTasks: UserResponse[] | boolean;
  canSeeInvoices: UserResponse[] | boolean;
  canSeeMyInvoices: UserResponse[] | boolean;

}



