import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor) // remove password field in all user response
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async all(): Promise<User[]> {
    return await this.userService.all();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash('12345', 10);
    return await this.userService.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password,
    });
  }

  @Get(':id')
  async get(@Param() id: number): Promise<User> {
    return await this.userService.findOne({ id });
  }
}
