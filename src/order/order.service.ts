import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract/abstract.service';
import { Order } from './models/order.entity';

@Injectable()
export class OrderService extends AbstractService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async paginate(page, relations) {
    const { data, meta } = await super.paginate(page, relations);
    return {
      data: data.map((order) => {
        const { first_name, last_name, id, name, email, total, ...others } =
          order;
        return {
          id,
          name,
          email,
          total,
          ...others,
        };
      }),
      meta,
    };
  }
  async chart() {
    return this.orderRepository.query(`
      SELECT DATE_FORMAT(o.created_at, '%d-%m-%Y') as date, sum(i.price * i.quantity) as sum
      FROM orders o
      JOIN orders_items i on o.id = i.order_id
      GROUP BY date;
    `);
  }
}
