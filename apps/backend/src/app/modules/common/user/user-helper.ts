import {UserResponseDto} from "./dto/user-response.dto";
import {User} from "./schemas/user.entity";

export class UserHelper {
    public static mapEntitiesToDto(data: User[]): UserResponseDto[] {
        if (Array.isArray(data)) {
            const result: UserResponseDto[] = [];
            data.forEach(d => {
               result.push(Object.assign(new UserResponseDto(), d));
            });
            return result;
        }
        throw new Error('Data must be array');
    }

    public static mapEntityToDto(data: User): UserResponseDto {
        return Object.assign(new UserResponseDto(), data);
    }
}