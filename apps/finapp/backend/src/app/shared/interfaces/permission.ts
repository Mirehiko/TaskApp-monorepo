export interface PermissionResponse {
  id: number;
  name: string;
  displayName: string;
}

export interface PermissionRequest {
  id?: number;
  name: string;
  displayName: string;
}
