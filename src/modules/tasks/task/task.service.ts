import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FilesService } from '../../../files/files.service';
import { TaskStates } from '../../../shared/enums/task/task-states';
import { BaseService, GetParams } from '../../base-service';
import { TaskRequestDto } from './dto/task-request.dto';
import { Task } from './schemas/task.entity';

@Injectable()
export class TaskService extends BaseService<Task> {
	
	constructor(
		@InjectRepository(Task)
		protected repository: Repository<Task>,
		private fileService: FilesService,
	) {
		super();
	}
	
	public async getBy(@Param() getParams: TaskGetParams): Promise<Task> {
		try {
			const requestObject: FindOneOptions<Task> = {
				where: {...getParams}
			};
			// if (params.withPermissions) {
			// requestObject.relations = ['roles', 'roles.permissions'];
			// }
			const user = await this.repository.findOne(requestObject);
			if (user) {
				return user; // 200
			}
			throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
		}
		catch (e) {
			throw new Error(e);
		}
	}
	
	public async create(@Param() requestDto: TaskRequestDto): Promise<any> {
		try {
			const newTask = await this.repository.create({...requestDto});
			// let role;
			// if (!requestDto.roles || !requestDto.roles.length) {
			// 	role = await this.roleService.getByID({id: 8});
			// 	newUser.roles = [role];
			// }

			return await this.repository.save(newTask); // 200
		} catch (e) {
			throw new Error(e);
		}
	}
	//
	// async updateUser(@Param() id: number, userRequestDto: UserRequestDto, avatar?: any): Promise<User> {
	// 	let user = await this.usersRepository.findOne(id);
	// 	if (!user) {
	// 		throw new HttpException('Нет такого пользователя', HttpStatus.NOT_FOUND);
	// 	}
	// 	user.email = userRequestDto.email ? userRequestDto.email : user.email;
	// 	user.password = userRequestDto.password ? userRequestDto.password : user.password;
	// 	// user.avatar = userRequestDto.avatar ? userRequestDto.avatar : user.avatar;
	// 	user.name = userRequestDto.name ? userRequestDto.name : user.name;
	//
	// 	if(avatar) {
	// 		user.avatar = await this.fileService.createFile(avatar);
	// 	}
	//
	// 	try {
	// 		await this.usersRepository.save(user);
	// 		if (userRequestDto.roles) {
	// 			user = await this.assignRolesToUser({userId: user.id, roles: userRequestDto.roles} );
	// 		}
	// 		return user;
	// 	}
	// 	catch (e) {
	// 		throw new Error(e);
	// 	}
	// }
	//
	// async assignRolesToUser(userRolesDto: UserRolesDto): Promise<any> {
	// 	const user = await this.usersRepository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});
	//
	// 	if (userRolesDto.roles.length && user) {
	// 		if (userRolesDto.replaceRoles) {
	// 			user.roles = userRolesDto.roles;
	// 		}
	// 		else {
	// 			const uRoles = user.roles.map(ur => ur.id);
	// 			user.roles = userRolesDto.roles.filter(r => !uRoles.includes(r.id)).concat(user.roles);
	// 		}
	// 		await this.usersRepository.save(user);
	// 		return await this.getUserBy({id: user.id});
	// 	}
	// 	throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
	// }
	//
	// async removeUserRoles(userRolesDto: UserRolesDto): Promise<any> {
	// 	const user = await this.usersRepository.findOne({ where: { id: userRolesDto.userId}, relations: ['roles']});
	//
	// 	if (userRolesDto.roles.length && user) {
	// 		const roles = userRolesDto.roles.map(r => r.id);
	// 		user.roles = user.roles.filter(ur => !roles.includes(ur.id));
	// 		await this.usersRepository.save(user);
	// 		return await this.getUserBy({id: user.id});
	// 	}
	// 	throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
	// }
	//
	
}

export interface TaskGetParams extends GetParams {
	state?: TaskStates;
	createdBy?: number[];
	reviewer?: number[];
	assignee?: number[];
	dateDue?: {
		startDate: string;
		endDate: string;
	};
}
