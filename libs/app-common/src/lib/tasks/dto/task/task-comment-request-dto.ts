import { TextType } from "../..";
import { IsOptional, IsString } from 'class-validator';


export class TaskCommentRequestDto {
  @IsString()
  body: string;

  @IsOptional()
  notifyUsers?: number[];

  @IsOptional()
  textType?: TextType;
}
