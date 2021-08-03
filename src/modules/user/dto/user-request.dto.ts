import { ID } from '../../../shared/types/id.type';

export class UserRequestDto {
  id?: ID;
  name: string;
  email: string;
  permissions: string[];
  avatar: string;
}
