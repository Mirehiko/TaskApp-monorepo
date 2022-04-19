import { BillStatus, BillType } from '../../enums';

export class BillRequestDto {
  name: string;
  description: string;
  status: BillStatus;
  balance?: number;
  type: BillType;
  userId?: number;
}
