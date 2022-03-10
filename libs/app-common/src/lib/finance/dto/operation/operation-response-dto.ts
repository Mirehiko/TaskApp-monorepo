import {IsEmail, IsNotEmpty} from "class-validator";
import {Expose} from "class-transformer";

export class OperationResponseDto {
  @Expose()
  id: number;

  @IsNotEmpty()
  @Expose()
  firstName: string;

  @IsNotEmpty()
  @Expose()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  // @IsNotEmpty()
  // password: string;
}
