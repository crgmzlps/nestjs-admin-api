import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}
  @Post('register')
  async register(@Body() body) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
    return await this.userService.create(body);
  }
}
