import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Role } from '../role/models/role.entity';
import { RoleService } from '../role/role.service';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler());
    if (!access) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const id = await this.authService.userId(request);
    const user: User = await this.userService.findOne(id, ['role']);
    const role: Role = await this.roleService.findOne({ id: user.role.id }, [
      'permissions',
    ]);

    if (request.method === 'GET') {
      return role.permissions.some(
        (p) =>
          p.name.toLocaleLowerCase() === `view_${access}`.toLocaleLowerCase() ||
          p.name.toLocaleLowerCase() === `edit_${access}`.toLocaleLowerCase(),
      );
    }

    return role.permissions.some(
      (p) =>
        p.name.toLocaleLowerCase() === `edit_${access}`.toLocaleLowerCase(),
    );
  }
}
