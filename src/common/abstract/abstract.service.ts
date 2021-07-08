import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

type PaginatedResult = {
  data: any[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
};

@Injectable()
export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}
  async all(relations = []): Promise<any[]> {
    return this.repository.find({ relations });
  }
  async create(data): Promise<any> {
    return this.repository.save(data);
  }
  async findOne(condition, relations = []): Promise<any> {
    const entity = this.repository.findOne(condition, { relations });
    if (!entity) {
      throw new NotFoundException('Register Not found');
    }
    return entity;
  }
  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }
  async remove(id: number) {
    return this.repository.delete(id);
  }

  async paginate(page, relations): Promise<PaginatedResult> {
    page = parseInt(page, 10) || 1;
    const take = 2;
    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
    });
    return {
      data,
      meta: {
        total,
        page: page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}
