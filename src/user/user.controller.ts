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
    return await this.userService.create(createUserDto);
  }

  @Get(':id')
  async get(@Param() id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.userService.remove(id);
    return;
  }
}
