import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract/abstract.service';
import { Role } from './models/role.entity';

@Injectable()
export class RoleService extends AbstractService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  async all() {
    return super.all(['permissions']);
  }

  async findOne(condition): Promise<Role> {
    return super.findOne(condition, ['permissions']);
  }
  async update(id: number, data): Promise<any> {
    const role = await super.findOne(id);
    const update = {
      ...role,
      ...data,
    };
    if (data.name) {
      update.name = data.name;
    }
    return await super.create(update);
  }
}
