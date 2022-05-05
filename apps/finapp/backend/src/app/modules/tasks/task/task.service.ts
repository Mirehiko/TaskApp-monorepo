import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService } from '../../base-service';
import { TaskGetParamsData } from './interfaces/task-params';
import { Task } from './schemas/task.entity';
import { OperationType, TaskRequestDto } from '@finapp/app-common';
import { TaskRepository } from './task-repository';
import { TagRepository } from '../tags/tag-repository';
import { ListRepository } from '../lists/list-repository';
import { UserRepository } from '../../common/user/user-repository';
import { In } from 'typeorm';


@Injectable()
export class TaskService extends BaseService<Task, TaskGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой задачи';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];

	constructor(
    protected repository: TaskRepository,
    protected listRepository: ListRepository,
    protected tagRepository: TagRepository,
    protected userRepository: UserRepository,
	) {
		super();
	}

	public async create(@Param() requestDto: TaskRequestDto): Promise<Task> {
    const newTask = new Task();
    newTask.dateDue = requestDto.dateDue;
    newTask.description = requestDto.description;
    newTask.icon = requestDto.icon;
    newTask.name = requestDto.name;
    newTask.status = requestDto.status;

	  if (requestDto.assignee) {
      newTask.assignee = await this.userRepository.find({id: In(requestDto.assignee)});
    }
    if (requestDto.reviewer) {
      newTask.reviewer = await this.userRepository.findOneOrFail({id: requestDto.reviewer});
    }
    if (requestDto.tags) {
      newTask.tags = await this.tagRepository.find({id: In(requestDto.tags)});
    }
    if (requestDto.lists) {
      newTask.lists = await this.listRepository.find({id: In(requestDto.lists)});
    }

    // TODO: Set current users as author
    // newTask.createdBy = requestDto.status;
    // newTask.updatedBy = requestDto.status;

    const createdTask = await this.repository.create(newTask);
    return await this.repository.save(createdTask); // 200
	}
	//
	// async updateUser(@Param() id: number, userRequestDto: CategoryRequestDto, avatar?: any): Promise<User> {
	// 	let operation = await this.usersRepository.findOne(id);
	// 	if (!operation) {
	// 		throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
	// 	}
	// 	operation.email = userRequestDto.email ? userRequestDto.email : operation.email;
	// 	operation.password = userRequestDto.password ? userRequestDto.password : operation.password;
	// 	// operation.avatar = userRequestDto.avatar ? userRequestDto.avatar : operation.avatar;
	// 	operation.name = userRequestDto.name ? userRequestDto.name : operation.name;
	//
	// 	if(avatar) {
	// 		operation.avatar = await this.fileService.createFile(avatar);
	// 	}
	//
	// 	try {
	// 		await this.usersRepository.save(operation);
	// 		if (userRequestDto.roles) {
	// 			operation = await this.assignRolesToUser({userId: operation.id, roles: userRequestDto.roles} );
	// 		}
	// 		return operation;
	// 	}
	// 	catch (e) {
	// 		throw new Error(e);
	// 	}
	// }
	//

  async delete(@Param() id: number): Promise<any> {
    const entity = await this.repository.findOne({where: {id}});
    if (!entity) {
      throw new HttpException(this.entityNotFoundMessage, HttpStatus.NOT_FOUND);
    }
    try {
      const childrens = await this.repository.find({parent_id: id});
      childrens.forEach(child => this.delete(child.id));
      await this.repository.remove(entity);
      return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
    }
    catch (e) {
      throw new Error(e);
    }
  }

}


