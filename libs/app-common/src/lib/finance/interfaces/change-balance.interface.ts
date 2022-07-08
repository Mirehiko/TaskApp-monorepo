import { OperationType } from "../enums";


export interface IChangeBalance {
  value: number;
  operationType: OperationType;
}
