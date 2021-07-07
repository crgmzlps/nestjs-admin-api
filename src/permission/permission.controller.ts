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
import { Permission } from './models/permission.entity';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async all(): Promise<Permission[]> {
    return await this.permissionService.all();
  }

  // @Post()
  // async create(@Body('name') name: string): Promise<Permission> {
  //   return await this.permissionService.create({ name });
  // }

  // @Get(':id')
  // async get(@Param() id: number): Promise<Permission> {
  //   return await this.permissionService.findOne({ id });
  // }

  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body('name') name: string,
  // ): Promise<Permission> {
  //   await this.permissionService.update(id, { name });
  //   return await this.permissionService.findOne(id);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async remove(@Param('id') id: number) {
  //   await this.permissionService.remove(id);
  //   return;
  // }
}
