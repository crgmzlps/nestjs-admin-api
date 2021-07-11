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

  async findOne(condition, relations = ['role']): Promise<User> {
    return super.findOne(condition, relations);
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
    const { role_id, password, ...others } = data;
    let update = { ...others };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      update = { ...update, password: hashedPassword };
    }
    if (role_id) {
      update = { ...update, role: { id: role_id } };
    }
    await super.update(id, update);
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
