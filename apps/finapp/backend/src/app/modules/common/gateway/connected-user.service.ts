import { ConnectedUserRepository } from './connected-user-repository';
import { ConnectedUserEntity } from './schemas/connected-user.entity';
import { User } from '../user/schemas/user.entity';
import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';


@Injectable()
export class ConnectedUserService {
  constructor(
    private readonly repository: ConnectedUserRepository,
  ) { }

  async create(socketId: string, user: User): Promise<ConnectedUserEntity> {
    return this.repository.save({ socketId, user });
  }

  async getUsers(users: User[]): Promise<ConnectedUserEntity[]> {
    return await this.repository.find({user: In(users)});
  }

  async findByUser(user: User): Promise<ConnectedUserEntity[]> {
    return this.repository.find({ user });
  }

  async deleteBySocketId(socketId: string) {
    return this.repository.delete({ socketId });
  }

  async deleteAll() {
    await this.repository
      .createQueryBuilder()
      .delete()
      .execute();
  }
}
