import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor) // remove password field in all user response
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async all(@Query('page') page: number) {
    return await this.userService.paginate(page);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash('12345', 10);
    const { role_id, ...data } = createUserDto;
    const user = await this.userService.create({
      ...data,
      password,
      role: { id: role_id },
    });
    return user;
  }

  @Get(':id')
  async get(@Param() id: number): Promise<User> {
    return await this.userService.findOne({ id });
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const { role_id, ...data } = updateUserDto;
    await this.userService.update(id, { ...data, role: { id: role_id } });
    return await this.userService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.userService.remove(id);
    return;
  }
}
