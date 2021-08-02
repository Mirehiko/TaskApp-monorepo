import { ID } from '../../../types/id.type';

export class UserResponseDto {
  id: ID;
  name: string;
  email: string;
  permissions: string[];
  avatar: string;
}
