import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  first_name: string;

  @Exclude()
  @Column()
  last_name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  order_items: OrderItem[];

  @Expose()
  get name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @Expose()
  get total(): number {
    return this.order_items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
  }
}
