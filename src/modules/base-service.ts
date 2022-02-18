import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { TaskStates } from '../shared/enums/task/task-states';
import { User } from './common/user/schemas/user.entity';
import { UserGetParams } from './common/user/userRequestParams';


export class BaseService<T> {
	protected repository: Repository<T>;
	
	public async getAll(): Promise<T[]> {
		return await this.repository.find();
	}
	
	public async delete(@Param() id: number): Promise<any> {
		try {
			const entity = await this.repository.findOne({where: {id}});
			await this.repository.remove(entity);
			return {status: HttpStatus.OK, statusText: 'Deleted successfully'};
		}
		catch (e) {
			throw new Error(e);
		}
	}
}
export interface GetParams {
	id?: number;
	name?: string;
	createdAt?: {
		startDate: string;
		endDate: string;
	};
	updatedAt?: {
		startDate: string;
		endDate: string;
	};
}