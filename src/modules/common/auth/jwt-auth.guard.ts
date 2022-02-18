import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {TokenService} from "../token/token.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private tokenService: TokenService,
                private jwtService: JwtService,
                private userService: UserService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: "User unauthorized"});
            }
            const user = await this.jwtService.verify(token);
            const exists = await this.tokenService.exists(user.id, token);
            if (!exists) {
                throw new UnauthorizedException({message: "User unauthorized"});
            }
            req.user = await this.userService.getUserBy({id: user.id});
            // TODO: Need to get user and his params
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: "User unauthorized"});
        }
    }
}