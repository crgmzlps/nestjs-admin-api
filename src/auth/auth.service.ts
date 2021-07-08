import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async userId(request: Request): Promise<number> {
    const jwt = request.cookies['jwt'];
    if (!jwt) {
      throw new BadRequestException('No token found');
    }
    const { id } = await this.jwtService.verifyAsync(jwt);
    return id;
  }
}
