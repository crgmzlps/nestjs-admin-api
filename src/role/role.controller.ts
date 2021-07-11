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
import { HasPermission } from '../permission/has-permission.decorator';
import { Role } from './models/role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @HasPermission('roles')
  @Get()
  async all(): Promise<Role[]> {
    return await this.roleService.all();
  }

  @HasPermission('roles')
  @Post()
  async create(
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ): Promise<Role> {
    const permissions = ids.map((id) => ({ id }));
    return await this.roleService.create({ name, permissions });
  }

  @HasPermission('roles')
  @Get(':id')
  async get(@Param() id: number): Promise<Role> {
    return await this.roleService.findOne(id);
  }

  @HasPermission('roles')
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ): Promise<Role> {
    const permissions = ids.map((id) => ({ id }));
    return await this.roleService.update(id, { name, permissions });
  }

  @HasPermission('roles')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.roleService.remove(id);
    return;
  }
}
