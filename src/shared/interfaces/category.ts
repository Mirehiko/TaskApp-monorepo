export interface CategoryResponse {
  id: number;
  name: string;
  displayName: string;
  childs?: CategoryResponse[];
}

export interface CategoryRequest {
  id?: number;
  name: string;
  displayName: string;
  childs: CategoryResponse[];
}
