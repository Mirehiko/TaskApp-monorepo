export interface CategoryResponse {
  id: number;
  name: string;
  displayName: string;
  children?: CategoryResponse[];
}

export interface CategoryRequest {
  id?: number;
  name: string;
  displayName: string;
  children: CategoryResponse[];
}
