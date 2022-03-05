import {IsString, IsDateString, IsNumber} from 'class-validator';
import {UserToken} from "../schemas/user-token.entity";

export class CreateUserTokenDto {
    @IsString()
    token: string;

    @IsNumber()
    userId: number;

    @IsDateString()
    expireAt: string;
}