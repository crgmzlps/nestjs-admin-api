import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async paginate(page) {
    page = parseInt(page, 10) || 1;
    const take = 2;
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });
    const usersWithoutPass = users.map((user) => {
      const { password, ...data } = user;
      return data;
    });
    return {
      data: usersWithoutPass,
      meta: {
        total,
        page: page,
        last_page: Math.ceil(total / take),
      },
    };
  }
  async all(): Promise<User[]> {
    return this.userRepository.find();
  }
  async create(data): Promise<User> {
    return this.userRepository.save(data);
  }
  async findOne(condition): Promise<User> {
    return this.userRepository.findOne(condition);
  }
  async update(id: number, data): Promise<any> {
    return this.userRepository.update(id, data);
  }
  async remove(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }
}
