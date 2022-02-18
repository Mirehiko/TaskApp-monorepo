import {Injectable, NotFoundException, Param} from '@nestjs/common';
import {CreateUserTokenDto} from "./dto/user-token-dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserToken} from "./schemas/user-token.entity";

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(UserToken)
        private repository: Repository<UserToken>,
    ) {}

    async create(@Param() createUserTokenDto: CreateUserTokenDto): Promise<CreateUserTokenDto> {
        const userToken = await this.repository.create({...createUserTokenDto});
        await this.repository.save(userToken);
        return {token: userToken.token, userId: userToken.userId, expireAt: userToken.expireAt+''};
    }

    async delete(userId: number, token: string): Promise<boolean> {
        const row = await this.repository.find({userId, token });
        if (row) {
            await this.repository.remove(row);
            return true;
        }
        throw new NotFoundException('Entities not found');
    }

    async deleteAll(userId: number): Promise<boolean> {
        const rows = await this.repository.find({userId});
        if (rows.length) {
            await this.repository.remove(rows);
            return true;
        }
        throw new NotFoundException('Entities not found');
    }

    async exists(userId: number, token: string): Promise<boolean> {
        const row = await this.repository.findOne({ userId, token });
        return !!row;
    }
}