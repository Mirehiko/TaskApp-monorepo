import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService,
    private reflector: Reflector) {
  }
  // TODO: Настроить нормальную проверку ролей
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      // const authHeader = req.headers.authorization;
      // const bearer = authHeader.split(' ')[0];
      // const token = authHeader.split(' ')[1];
      //
      // if (bearer !== 'Bearer' || !token) {
      //     throw new UnauthorizedException({message: "User unauthorized"});
      // }
      // const operation = this.jwtService.verify(token);
      // req.operation = await this.userService.getUserBy({id: operation.id});
      return req.user.roles.some(role => requiredRoles.includes(role.name));
    }
    catch (e) {
      throw new HttpException( "Access denied", HttpStatus.FORBIDDEN);
    }

  }
}
