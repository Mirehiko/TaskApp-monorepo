import { OperationStatus, OperationType } from '@finapp/app-common';
import { IsNotEmpty, IsOptional } from "class-validator";
import { Expose } from 'class-transformer';


export class OperationRequestDto {
  @IsOptional()
  id?: number;

  billId: number;

  @Expose()
  comment: string;

  @Expose()
  status: OperationStatus;

  @Expose()
  type: OperationType;

  @Expose()
  value: number;

  @Expose()
  metadata: string;
//   metadata?: OperationMetadata;
}
