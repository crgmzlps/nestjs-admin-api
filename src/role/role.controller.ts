import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from './models/role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async all(): Promise<Role[]> {
    return await this.roleService.all();
  }

  @Post()
  async create(
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ): Promise<Role> {
    const permissions = ids.map((id) => ({ id }));
    return await this.roleService.create({ name, permissions });
  }

  @Get(':id')
  async get(@Param() id: number): Promise<Role> {
    return await this.roleService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ): Promise<Role> {
    const permissions = ids.map((id) => ({ id }));
    return await this.roleService.update(id, { name, permissions });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.roleService.remove(id);
    return;
  }
}
