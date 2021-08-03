import { Permission } from './permission';

export interface FeatureResponse {
  id: number;
  displayName: string;
  name: string;
  permissions?: Permission[];
}

export interface FeatureRequest {
  id?: number;
  displayName: string;
  name: string;
  permissions: Permission[];
}
