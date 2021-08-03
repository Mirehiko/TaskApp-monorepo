export interface RoleResponse {
  id: number;
  name: string;
  displayName: string;
}

export interface RoleRequest {
  id?: number;
  name: string;
  displayName: string;
}
