export interface IGetParamsData {
  withRelations?: boolean;
  checkOnly?: boolean;
  params?: IGetParams;
}

export interface IGetParams {
  id?: number;
  name?: string;
  createdAt?: {
    startDate: string;
    endDate: string;
  };
  updatedAt?: {
    startDate: string;
    endDate: string;
  };
  withDeleted?: boolean;
}
