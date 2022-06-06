import { TaskResponseDto, TextType } from '@finapp/app-common';
import { Exclude, Expose } from 'class-transformer';


export class TaskCommentResponseDto {
  @Expose()
  id: number

  @Expose()
  body: string;

  @Expose()
  notifyUsers?: number[];

  @Expose()
  textType?: TextType;

  @Exclude()
  task: TaskResponseDto;
}
