import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post, Req, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { TaskCommentRequestDto, TaskCommentResponseDto } from '@finapp/app-common';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { TaskCommentService } from './task-comment.service';


@ApiTags('Комментарии')
@Controller('main/task')
@UseGuards(JwtAuthGuard)
// @UseInterceptors(new TransformInterceptor())
export class TaskCommentController {
  constructor(
    private readonly service: TaskCommentService,
  ) {
  }

  @ApiOperation({summary: 'Получение списка комментариев'})
  @ApiResponse({status: 200, type: [TaskCommentResponseDto]})
  @Get(':taskId/comments')
  async getComments(@Param('taskId') taskId: number): Promise<TaskCommentResponseDto[]> {
    const comments = await this.service.getTaskComments(taskId);
    return plainToClass(TaskCommentResponseDto, comments, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Создание задачи/подзадачи'})
  @Post(':taskId/comment')
  async createComment(
    @Param('taskId') taskId: number,
    @Body() taskCommentRequestDto: TaskCommentRequestDto, @Req() req): Promise<TaskCommentResponseDto> {
    const comment = await this.service.createComment(taskId, taskCommentRequestDto, req.user);
    if (comment.notifyUsers.length) {

    }
    return plainToClass(TaskCommentResponseDto, comment, { enableCircularCheck: true });
  }

  @ApiOperation({summary: 'Обновление задачи'})
  @Patch(':taskId/comment/:commentId')
  async update(
    @Param('commentId') commentId: number,
    @Body() taskCommentRequestDto: TaskCommentRequestDto,
    @Req() req): Promise<TaskCommentResponseDto> {
    const comment = await this.service.updateComment(commentId, taskCommentRequestDto, req.user);
    return plainToClass(TaskCommentResponseDto, comment, { enableCircularCheck: true, enableImplicitConversion: true });
  }

  @ApiOperation({summary: 'Удаление комментария'})
  @Delete(':taskId/comment/:commentId')
  async deleteComment(@Param('commentId') commentId: number): Promise<any> {
    return await this.service.delete([commentId]);
  }

  @ApiOperation({summary: 'Удаление задач'})
  @Delete(':taskId/comments')
  async commentsDelete(@Body('commentIds') ids): Promise<any> {
    return await this.service.delete(ids);
  }
}
