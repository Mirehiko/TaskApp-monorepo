import { PermissionResponse } from "./permission";

export interface RoleResponse {
  id: number;
  name: string;
  displayName: string;
  permissions: PermissionResponse[];
}

export interface RoleRequest {
  id?: number;
  name: string;
  displayName: string;
  permissions: PermissionResponse[];
}
