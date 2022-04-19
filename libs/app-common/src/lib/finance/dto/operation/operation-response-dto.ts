import { IsOptional } from 'class-validator';
import {Expose} from "class-transformer";
import { OperationStatus, OperationType } from '../../enums';
import { UserResponseDto } from '../../../common';


export class OperationResponseDto {
  @IsOptional()
  id: number;

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
