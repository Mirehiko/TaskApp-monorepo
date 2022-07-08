import { Expose } from 'class-transformer';
import { TextType } from '../..';
import { IsOptional } from 'class-validator';


export class TaskCommentResponseDto {
  @Expose()
  id: number

  @Expose()
  body: string;

  @IsOptional()
  @Expose()
  notifyUsers?: number[];

  @Expose()
  textType: TextType;
}
