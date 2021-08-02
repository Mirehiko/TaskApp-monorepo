import { Injectable } from '@nestjs/common';
import { ID } from '../../types/id.type';
import { UserRequestDto } from './dto/user-request.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async getAll(): Promise<UserResponseDto[]> {
    return;
  }

  async getById(id: ID): Promise<UserResponseDto> {
    return;
  }

  async createUser(user: UserRequestDto): Promise<any> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateUser(id: ID, user: UserRequestDto): Promise<UserResponseDto> {
    await this.userModel.findByIdAndUpdate(id, user);
    // return newUser as UserResponseDto;
    return;
  }

  async deleteUser(id: ID): Promise<any> {
    return this.userModel.findByIdAndRemove(id);
  }
}
