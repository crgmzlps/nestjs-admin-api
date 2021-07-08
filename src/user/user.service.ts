import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract/abstract.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService extends AbstractService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findOne(condition): Promise<User> {
    return super.findOne(condition, ['role']);
  }

  async create(data): Promise<User> {
    const password = await bcrypt.hash('12345', 10);
    const { role_id, ...others } = data;
    return super.create({
      ...others,
      password,
      role: { id: role_id },
    });
  }

  async update(id, data) {
    const { role_id, ...others } = data;
    await super.update(id, { ...others, role: { id: role_id } });
    return this.findOne(id);
  }

  async paginate(page) {
    const { data, meta } = await super.paginate(page, ['role']);
    return {
      data: data.map((user) => {
        const { password, ...others } = user;
        return others;
      }),
      meta,
    };
  }
}
