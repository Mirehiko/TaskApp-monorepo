import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class OperationRequestDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password?: string;
}
