import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}
  @Post('register')
  async register(@Body() body) {
    return await this.userService.create(body);
  }
}
