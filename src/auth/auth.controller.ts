import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { password, password_confirm } = registerUserDto;
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    registerUserDto.password = hashedPassword;
    return await this.userService.create(registerUserDto);
  }
}
