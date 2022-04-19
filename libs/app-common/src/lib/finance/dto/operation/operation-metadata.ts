import { CategoryResponseDto, UserResponseDto } from '@finapp/app-common';


export interface OperationMetadata {
  user: UserResponseDto;
  category: CategoryResponseDto;
}
