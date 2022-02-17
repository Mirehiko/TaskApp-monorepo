import {Injectable, NotFoundException, Param} from '@nestjs/common';
import {CreateUserTokenDto} from "./dto/user-token-dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserToken} from "./schemas/user-token.entity";

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(UserToken)
        private userTokenRepository: Repository<UserToken>,
    ) {}

    async create(@Param() createUserTokenDto: CreateUserTokenDto): Promise<CreateUserTokenDto> {
        const userToken = await this.userTokenRepository.create({...createUserTokenDto});
        await this.userTokenRepository.save(userToken);
        return {token: userToken.token, userId: userToken.userId, expireAt: userToken.expireAt+''};
    }

    async delete(userId: number, token: string): Promise<boolean> {
        const row = await this.userTokenRepository.find({userId, token });
        if (row) {
            await this.userTokenRepository.remove(row);
            return true;
        }
        throw new NotFoundException('Entities not found');
    }

    async deleteAll(userId: number): Promise<boolean> {
        const rows = await this.userTokenRepository.find({userId});
        if (rows.length) {
            await this.userTokenRepository.remove(rows);
            return true;
        }
        throw new NotFoundException('Entities not found');
    }

    async exists(userId: number, token: string): Promise<boolean> {
        const row = await this.userTokenRepository.findOne({ userId, token });
        return !!row;
    }
}