import { Injectable } from '@nestjs/common';
import {PermissionResponseDto} from "./dto/permission-response.dto";

@Injectable()
export class PermissionService {
    async getAll(): Promise<PermissionResponseDto[]> {
        return;
    }

    async getPermission(): Promise<PermissionResponseDto> {
        return;
    }

    async createPermission(): Promise<PermissionResponseDto> {
        return;
    }

    async updatePermission(): Promise<PermissionResponseDto> {
        return;
    }

    async deletePermission(): Promise<PermissionResponseDto> {
        return;
    }
}
