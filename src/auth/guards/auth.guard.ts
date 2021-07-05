import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const jwt = request.cookies['jwt'];
      return this.jwtService.verify(jwt);
    } catch (e) {
      return false;
    }
  }
}
