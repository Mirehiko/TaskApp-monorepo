import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FilesService } from '../../../files/files.service';
import { BaseService, GetParams, GetParamsData } from '../../base-service';
import { TaskRequestDto } from '../../../../../../../../libs/app-common/src/lib/tasks/dto/task/task-request.dto';
import { TaskGetParamsData } from './interfaces/task-params';
import { Task } from './schemas/task.entity';

@Injectable()
export class TaskService extends BaseService<Task, TaskGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такой задачи';
	protected entityOrRelationNotFoundMessage: string = '';
	protected relations: string[] = ['createdBy', 'createdBy.users'];

	constructor(
		@InjectRepository(Task)
		protected repository: Repository<Task>,
		private fileService: FilesService,
	) {
		super();
	}

	public async create(@Param() requestDto: TaskRequestDto): Promise<any> {
		try {
			const newTask = await this.repository.create({...requestDto});
			return await this.repository.save(newTask); // 200
		} catch (e) {
			throw new Error(e);
		}
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
	// async assignRolesToUser(userRolesDto: UserRolesDto): Promise<any> {
	// 	const operation = await this.usersRepository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});
	//
	// 	if (userRolesDto.roles.length && operation) {
	// 		if (userRolesDto.replaceRoles) {
	// 			operation.roles = userRolesDto.roles;
	// 		}
	// 		else {
	// 			const uRoles = operation.roles.map(ur => ur.id);
	// 			operation.roles = userRolesDto.roles.filter(r => !uRoles.includes(r.id)).concat(operation.roles);
	// 		}
	// 		await this.usersRepository.save(operation);
	// 		return await this.getUserBy({id: operation.id});
	// 	}
	// 	throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
	// }
	//
	// async removeUserRoles(userRolesDto: UserRolesDto): Promise<any> {
	// 	const operation = await this.usersRepository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});
	//
	// 	if (userRolesDto.roles.length && operation) {
	// 		const roles = userRolesDto.roles.map(r => r.id);
	// 		operation.roles = operation.roles.filter(ur => !roles.includes(ur.id));
	// 		await this.usersRepository.save(operation);
	// 		return await this.getUserBy({id: operation.id});
	// 	}
	// 	throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
	// }
	//

}


