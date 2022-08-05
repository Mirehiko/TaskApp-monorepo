import { CategoryResponseDto, UserResponseDto } from '@taskapp/app-common';


export interface OperationMetadata {
  user: UserResponseDto;
  category: CategoryResponseDto;
}
