import {PermissionResponse} from "./permission";

export interface FeatureResponse {
  id: number;
  displayName: string;
  name: string;
  permissions?: PermissionResponse[];
}

export interface FeatureRequest {
  id?: number;
  displayName: string;
  name: string;
  permissions: PermissionResponse[];
}
