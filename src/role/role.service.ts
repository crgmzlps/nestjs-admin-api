import { All, Injectable } from '@nestjs/common';
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
    return this.roleRepository.findOne(condition);
  }
  async update(id: number, data): Promise<any> {
    data.name = data.name.toUpperCase();
    return this.roleRepository.update(id, data);
  }
  async remove(id: number): Promise<any> {
    return this.roleRepository.delete(id);
  }
}
