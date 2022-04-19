import { OperationType } from '@finapp/app-common';

export interface ChangeBalance {
  value: number;
  operationType: OperationType;
}
