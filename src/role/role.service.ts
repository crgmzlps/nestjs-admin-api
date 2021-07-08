import { All, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './models/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async all(): Promise<Role[]> {
    return this.roleRepository.find();
  }
  async create(data): Promise<Role> {
    data.name = data.name.toUpperCase();
    return this.roleRepository.save(data);
  }
  async findOne(condition): Promise<Role> {
    const role = await this.roleRepository.findOne(condition, {
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
  async update(id: number, data): Promise<any> {
    const role = await this.findOne(id);
    const update = {
      ...role,
      ...data,
    };
    if (data.name) {
      update.name = data.name.toUpperCase();
    }
    return await this.create(update);
  }
  async remove(id: number): Promise<any> {
    return this.roleRepository.delete(id);
  }
}
