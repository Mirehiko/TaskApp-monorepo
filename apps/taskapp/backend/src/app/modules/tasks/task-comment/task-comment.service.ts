import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService } from '../../base-service';
import { IGetParamsData, TaskCommentRequestDto, TextType } from '@taskapp/app-common';
import { TaskCommentEntity } from './schemas/task-comment.entity';
import { TaskCommentRepository } from './task-comment-repository';
import { User } from '../../common/user/schemas/user.entity';
import { UserRepository } from '../../common/user/user-repository';
import { In } from 'typeorm';
import { TaskTreeRepository } from '../task/task-repository';


@Injectable()
export class TaskCommentService extends BaseService<TaskCommentEntity, IGetParamsData> {
  protected entityNotFoundMessage: string = 'Нет такой роли';

  constructor(
    protected repository: TaskCommentRepository,
    private userRepository: UserRepository,
    private taskRepository: TaskTreeRepository,
  ) {
    super();
  }

  /**
   * Get list of comments for task
   * @param taskId
   * @param relations
   */
  public async getTaskComments(taskId: number, relations: string[] = []): Promise<TaskCommentEntity[]> {
    return await this.repository.find({where: {id: taskId}, relations});
  }

  /**
   * Add new comment to task
   * @param taskId
   * @param taskCommentRequestDto
   * @param author
   */
  async createComment(taskId: number, taskCommentRequestDto: TaskCommentRequestDto, author: User = null): Promise<TaskCommentEntity> {
    const task = await this.taskRepository.findOne(taskId);
    if (!task) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    const comment = new TaskCommentEntity();

    comment.body = taskCommentRequestDto.body;
    comment.textType = taskCommentRequestDto.textType || TextType.DEFAULT;
    comment.createdBy = author;
    comment.updatedBy = author;
    comment.task = task;

    if (taskCommentRequestDto.notifyUsers) {
      comment.notifyUsers = await this.userRepository.find({where: {id: In(taskCommentRequestDto.notifyUsers)}})
    }

    const createdComment = await this.repository.create(comment);
    return await this.repository.save(createdComment);
  }

  /**
   * Updates task comment
   * @param id
   * @param taskCommentRequestDto
   * @param author
   */
  async updateComment(@Param() id: number, taskCommentRequestDto: TaskCommentRequestDto, author: User = null): Promise<TaskCommentEntity> {
    const comment = await this.repository.findOne(id, { relations: ['createdBy'] });
    if (!comment) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }

    comment.body = taskCommentRequestDto.body || comment.body;
    comment.textType = taskCommentRequestDto.textType || comment.textType;
    comment.updatedBy = author;

    try {
      return await this.repository.save(comment);
    }
    catch (e) {
      throw new Error(e);
    }
  }
}
