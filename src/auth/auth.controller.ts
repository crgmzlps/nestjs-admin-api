import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // remove password field in all user response
export class AuthController {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });
    return user;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Success logout' };
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async user(@Req() request: Request) {
    const jwt = request.cookies['jwt'];
    if (!jwt) {
      throw new BadRequestException('No token found');
    }
    const data = await this.jwtService.verifyAsync(jwt);
    return await this.userService.findOne({ id: data.id });
  }
}
