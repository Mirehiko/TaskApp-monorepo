import { ID } from '../../../shared/types/id.type';
import {Permission} from "../../../shared/interfaces/permission";

export class UserResponseDto {
  id: ID;
  name: string;
  email: string;
  permissions: Permission[];
  avatar: string;
}
