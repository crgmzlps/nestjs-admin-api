import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './models/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async all(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
  async create(data): Promise<Permission> {
    data.name = data.name.toUpperCase();
    return this.permissionRepository.save(data);
  }
  async findOne(condition): Promise<Permission> {
    const permission = await this.permissionRepository.findOne(condition);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
  async update(id: number, data): Promise<any> {
    data.name = data.name.toUpperCase();
    return this.permissionRepository.update(id, data);
  }
  async remove(id: number): Promise<any> {
    return this.permissionRepository.delete(id);
  }
}
