import {HttpStatus, Injectable, Param, Res} from '@nestjs/common';
import {RoleRequestDto} from "./dto/role-request.dto";
import { Role } from './schemas/role.entity';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {RoleResponseDto} from "./dto/role-response.dto";


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async getAll(): Promise<RoleResponseDto[]> {
        return await this.roleRepository.find();
    }

    async getByID(@Param() id: number, @Res() response): Promise<RoleResponseDto | any> {
        console.log(id)
        const role = await this.roleRepository.findOne({id});
        if (role) {
            return Object.assign(role, {permissions: []});
        }
        else {
            response
                .status(HttpStatus.NOT_FOUND)
                .json({message: "Нет такой роли"});
        }
    }

    async getBy(@Param() params, @Res() response): Promise<RoleResponseDto | any> {
        const role = await this.roleRepository.findOne(params);
        if (role) {
            return Object.assign(role, {permissions: []});
        }
        else {
            response
                .status(HttpStatus.NOT_FOUND)
                .json({message: "Нет такой роли"});
        }
    }

    async createRole(role: RoleRequestDto, @Res() response): Promise<any> {
        console.log(role)
        const candidate = await this.roleRepository.findOne({ displayName: role.displayName });
        if (candidate) {
            response
                .status(HttpStatus.CONFLICT)
                .json({message: "Такая роль уже существует. Введите другое имя роли"});
        }
        else {
            // const salt = bcrypt.genSaltSync(10);
            // const password = req.body.password;
            //
            // console.log(req.body)

            // if (userRequestDto.avatar) {
            //   userInfo.avatar = req.body.avatar;
            // }


            try {
                const newRole = await this.roleRepository.create({...role});
                // newUser.roles = [role];
                await this.roleRepository.save(newRole).then(() => {
                    console.log('Role created');
                });
                // await this.usersRepository.save(newUser);
                response
                    .status(HttpStatus.CREATED)
                    .json(newRole);

            } catch (error) { /*errorHandler(res, error);*/ }
        }
    }

    async updateRole(@Param() id: number, role: RoleRequestDto): Promise<RoleResponseDto> {
        return;
    }

    async deleteRole(@Param() id: number): Promise<RoleResponseDto> {
        return;
    }
}
